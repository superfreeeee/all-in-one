fn main() {
    println!("Hello, world!");
}

#[cfg(test)]
mod env_tests {
    use std::{env, io};

    #[test]
    fn cwd_test() -> Result<(), io::Error> {
        let cwd = env::current_dir()?;
        let cmd = env::current_exe()?;
        println!("cwd={cwd:?}");
        println!("cmd={cmd:?}");

        Ok(())
    }
}

#[cfg(test)]
mod ansi_term_tests {
    use ansi_term::{Color, Style};

    #[test]
    fn color_test() {
        let msg = "default message";
        println!("==========> Style");
        println!("plain     : {}", Style::new().paint(msg));
        println!("dimmed    : {}", Style::new().dimmed().paint(msg));
        println!("bold      : {}", Style::new().bold().paint(msg));
        println!("underline : {}", Style::new().underline().paint(msg));

        let msg = "error message";
        println!("==========> Red");
        println!("plain     : {}", Color::Red.paint(msg));
        println!("dimmed    : {}", Color::Red.dimmed().paint(msg));
        println!("bold      : {}", Color::Red.bold().paint(msg));
        println!("underline : {}", Color::Red.underline().paint(msg));

        let msg = "success message";
        println!("==========> Green");
        println!("plain     : {}", Color::Green.paint(msg));
        println!("dimmed    : {}", Color::Green.dimmed().paint(msg));
        println!("bold      : {}", Color::Green.bold().paint(msg));
        println!("underline : {}", Color::Green.underline().paint(msg));

        let msg = "info message";
        println!("==========> Blue");
        println!("plain     : {}", Color::Blue.paint(msg));
        println!("dimmed    : {}", Color::Blue.dimmed().paint(msg));
        println!("bold      : {}", Color::Blue.bold().paint(msg));
        println!("underline : {}", Color::Blue.underline().paint(msg));

        let msg = "info message";
        println!("==========> Cyan");
        println!("plain     : {}", Color::Cyan.paint(msg));
        println!("dimmed    : {}", Color::Cyan.dimmed().paint(msg));
        println!("bold      : {}", Color::Cyan.bold().paint(msg));
        println!("underline : {}", Color::Cyan.underline().paint(msg));
    }
}

#[cfg(test)]
mod log_tests {
    use log::{info, warn, LevelFilter};

    #[test]
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
}
