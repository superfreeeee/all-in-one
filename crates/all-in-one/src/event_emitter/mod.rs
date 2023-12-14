use std::{collections::HashMap, sync::Arc};

type Handler = Arc<dyn Fn()>;

pub struct EventEmitter {
    listeners_map: HashMap<&'static str, Vec<Handler>>,
}

impl EventEmitter {
    pub fn new() -> Self {
        EventEmitter {
            listeners_map: HashMap::new(),
        }
    }

    pub fn on(&mut self, event: &'static str, handler: Handler) {
        let handlers = self.listeners_map.entry(event).or_insert_with(|| vec![]);
        handlers.push(handler.clone());
    }

    pub fn call(&self, event: &'static str) {
        if let Some(handlers) = self.listeners_map.get(event) {
            handlers.iter().for_each(|handler| handler())
        }
    }
}

#[cfg(test)]
mod event_emitter_tets {
    use std::sync::Arc;

    use super::EventEmitter;

    #[test]
    fn mvp_test() {
        let mut emitter = EventEmitter::new();
        emitter.on("a", Arc::new(|| println!("listener a.1")));
        emitter.on("a", Arc::new(|| println!("listener a.2")));
        emitter.on("b", Arc::new(|| println!("listener b.1")));
        emitter.call("a");
        emitter.call("b");
        emitter.call("a");
        emitter.call("c");
    }
}
