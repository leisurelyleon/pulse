# ---- build stage ----
FROM rust:1-slim-bookworm AS builder
WORKDIR /app

# Copy manifests first so dependency compilation is cached across source edits.
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release && rm -rf src

# Build the real sources.
COPY src ./src
RUN touch src/main.rs && cargo build --release

# ---- runtime stage ----
FROM debian:bookworm-slim AS runtime
WORKDIR /app
COPY --from=builder /app/target/release/pulse-server /usr/local/bin/pulse-server
ENV PORT=8080
EXPOSE 8080
CMD ["pulse-server"]
