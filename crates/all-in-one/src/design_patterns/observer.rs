use std::collections::HashSet;

pub struct Publisher {
    name: String,
    subscribers: HashSet<Subscriber>,
}

impl Publisher {
    pub fn new(name: &str) -> Self {
        Publisher {
            name: name.to_string(),
            subscribers: HashSet::new(),
        }
    }

    pub fn add_subscriber(&mut self, subscriber: &Subscriber) {
        self.subscribers.insert(subscriber.clone());
    }

    pub fn remove_subscriber(&mut self, subscriber: &Subscriber) {
        self.subscribers.retain(|sub| sub != subscriber)
    }

    pub fn notify_all(&self) {
        self.subscribers.iter().for_each(|sub| {
            sub.notify(self);
        })
    }
}

#[derive(PartialEq, Eq, Hash, Clone)]
pub struct Subscriber {
    name: String,
}

impl Subscriber {
    pub fn new(name: &str) -> Self {
        Subscriber {
            name: name.to_string(),
        }
    }

    fn notify(&self, publisher: &Publisher) {
        println!(
            "notify Subscriber({}) by Publisher({})",
            self.name, publisher.name
        );
    }
}
