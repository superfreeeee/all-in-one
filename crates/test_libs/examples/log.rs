use log::{info, warn, LevelFilter};

fn log_test() {
    // with default info level
    env_logger::builder()
        .filter_level(LevelFilter::Info)
        .format_target(false) // format test name
        // .format_timestamp_secs() // format time precision
        .init();
    // env_logger::init();

    info!("starting up");
    warn!("oops, nothing implemented!");
}

fn main() {
    log_test();
}
