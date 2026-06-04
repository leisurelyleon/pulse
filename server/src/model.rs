use serde::Serialize;

/// A single metric series: its current value, the change since the previous
/// tick, and a rolling window of recent values for the sparkline/area chart.
#[derive(Debug, Clone, Serialize)]
pub struct Series {
    pub id: String,
    pub label: String,
    pub unit: String,
    pub value: f64,
    pub delta: f64,
    pub history: Vec<f64>,
}

/// One slice of the categorical breakdown (e.g. traffic by region).
#[derive(Debug, Clone, Serialize)]
pub struct Category {
    pub label: String,
    pub value: f64,
}

/// The full payload pushed to every client on each tick.
#[derive(Debug, Clone, Serialize)]
pub struct Snapshot {
    pub ts: u64,
    pub series: Vec<Series>,
    pub categories: Vec<Category>,
}
