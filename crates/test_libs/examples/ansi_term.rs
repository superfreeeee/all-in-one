use ansi_term::{Color, Style};

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

fn main() {
    color_test();
}
