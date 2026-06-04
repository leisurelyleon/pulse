use crate::model::{Category, Series, Snapshot};
use rand::rngs::SmallRng;
use rand::{Rng, SeedableRng};
use std::time::{SystemTime, UNIX_EPOCH};

const HISTORY: usize = 48;

/// Mutable state for one simulated metric, evolved as a bounded random walk
/// with gentle mean reversion so the series stays lively but plausible.
struct SeriesState {
    id: &'static str,
    label: &'static str,
    unit: &'static str,
    value: f64,
    min: f64,
    max: f64,
    volatility: f64,
    history: Vec<f64>,
}

impl SeriesState {
    fn new(
        id: &'static str,
        label: &'static str,
        unit: &'static str,
        value: f64,
        min: f64,
        max: f64,
        volatility: f64,
    ) -> Self {
        Self {
            id,
            label,
            unit,
            value,
            min,
            max,
            volatility,
            history: vec![value; HISTORY],
        }
    }

    fn advance(&mut self, rng: &mut SmallRng) -> Series {
        let previous = self.value;
        let step: f64 = rng.gen_range(-self.volatility..self.volatility);
        let midpoint = (self.min + self.max) / 2.0;
        let reversion = (midpoint - self.value) * 0.01;
        self.value = (self.value + step + reversion).clamp(self.min, self.max);

        self.history.push(self.value);
        if self.history.len() > HISTORY {
            self.history.remove(0);
        }

        Series {
            id: self.id.to_string(),
            label: self.label.to_string(),
            unit: self.unit.to_string(),
            value: round1(self.value),
            delta: round1(self.value - previous),
            history: self.history.iter().map(|v| round1(*v)).collect(),
        }
    }
}

/// Owns every simulated series plus the categorical breakdown and produces a
/// fresh Snapshot on each tick.
pub struct MetricsGenerator {
    rng: SmallRng,
    series: Vec<SeriesState>,
    categories: Vec<(&'static str, f64)>,
}

impl MetricsGenerator {
    pub fn new() -> Self {
        Self {
            rng: SmallRng::from_entropy(),
            series: vec![
                SeriesState::new(
                    "rps",
                    "Requests / sec",
                    "req/s",
                    1200.0,
                    200.0,
                    4000.0,
                    140.0,
                ),
                SeriesState::new("latency", "p95 Latency", "ms", 120.0, 40.0, 600.0, 18.0),
                SeriesState::new("cpu", "CPU Load", "%", 47.0, 5.0, 99.0, 6.0),
                SeriesState::new(
                    "active",
                    "Active Users",
                    "users",
                    8600.0,
                    1000.0,
                    20000.0,
                    380.0,
                ),
            ],
            categories: vec![
                ("US-East", 38.0),
                ("US-West", 24.0),
                ("EU", 22.0),
                ("APAC", 16.0),
            ],
        }
    }

    pub fn tick(&mut self) -> Snapshot {
        let Self {
            rng,
            series,
            categories,
        } = self;

        let series_out = series.iter_mut().map(|s| s.advance(rng)).collect();
        let categories_out = categories
            .iter_mut()
            .map(|entry| {
                let delta: f64 = rng.gen_range(-1.5..1.5);
                entry.1 = (entry.1 + delta).clamp(2.0, 60.0);
                Category {
                    label: entry.0.to_string(),
                    value: round1(entry.1),
                }
            })
            .collect();

        Snapshot {
            ts: now_ms(),
            series: series_out,
            categories: categories_out,
        }
    }
}

impl Default for MetricsGenerator {
    fn default() -> Self {
        Self::new()
    }
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

fn round1(value: f64) -> f64 {
    (value * 10.0).round() / 10.0
}
