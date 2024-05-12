use std::io::{Error, ErrorKind};

#[test]
fn smoke_test() {
    let result = Ok::<(), Error>(());
    let result = Err::<(), _>(Error::new(ErrorKind::AlreadyExists, "haha"));
    result.is_ok();
    match result {
        Ok(data) => {}
        Err(err) => {}
    }
}
