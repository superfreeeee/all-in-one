use std::sync::Arc;

use all_in_one::EventEmitter;

fn main() {
    let mut emitter = EventEmitter::new();
    emitter.on(
        "test",
        Arc::new(|| {
            println!("test 1");
        }),
    );
    emitter.on(
        "test",
        Arc::new(|| {
            println!("test 2");
        }),
    );

    println!("===> 1");
    emitter.call("test");
    println!();
    println!("===> 2");
    emitter.call("test");
}
