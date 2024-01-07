use std::{env, io::Error};

fn cwd_test() -> Result<(), Error> {
    let cwd = env::current_dir()?;
    let cmd = env::current_exe()?;
    println!("cwd: {:?}", cwd);
    println!("cmd: {:?}", cmd);

    Ok(())
}

fn main() {
    let _ = cwd_test();
}
