mod metrics;
mod model;
mod ws;

use axum::{routing::get, Router};
use std::net::SocketAddr;
use std::time::Duration;
use tokio::sync::broadcast;
use tokio::time;

/// Shared application state: the broadcast sender that fans pre-serialized
/// snapshots out to every connected WebSocket.
#[derive(Clone)]
pub struct AppState {
    pub tx: broadcast::Sender<String>,
}

#[tokio::main]
async fn main() {
    let (tx, _rx) = broadcast::channel::<String>(16);

    // Background producer: tick once a second, advance the metrics, and
    // broadcast the serialized snapshot to all subscribers.
    {
        let tx = tx.clone();
        tokio::spawn(async move {
            let mut generator = metrics::MetricsGenerator::new();
            let mut interval = time::interval(Duration::from_millis(1000));
            loop {
                interval.tick().await;
                let snapshot = generator.tick();
                if let Ok(json) = serde_json::to_string(&snapshot) {
                    // Err just means no clients are connected right now.
                    let _ = tx.send(json);
                }
            }
        });
    }

    let app = Router::new()
        .route("/", get(health))
        .route("/health", get(health))
        .route("/ws", get(ws::ws_handler))
        .with_state(AppState { tx });

    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(8080);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind listener");
    println!("pulse server listening on {addr}");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("server error");
}

async fn health() -> &'static str {
    "pulse ok"
}

/// Resolve when the process receives Ctrl-C, allowing a clean shutdown.
async fn shutdown_signal() {
    let _ = tokio::signal::ctrl_c().await;
}
