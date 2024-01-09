use all_in_one::design_patterns::observer::{Publisher, Subscriber};

fn main() {
    let mut publisher = Publisher::new("pub 1");
    let subscriber1 = Subscriber::new("sub 1");
    let subscriber2 = Subscriber::new("sub 2");

    publisher.add_subscriber(&subscriber1);

    println!("> notify_all 1");
    publisher.notify_all();

    publisher.add_subscriber(&subscriber1);
    publisher.add_subscriber(&subscriber2);

    println!("> notify_all 2");
    publisher.notify_all();

    publisher.remove_subscriber(&subscriber1);

    println!("> notify_all 3");
    publisher.notify_all();
}
