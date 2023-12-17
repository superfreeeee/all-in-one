use std::{error::Error, path::PathBuf};

use clap::{Parser, Subcommand};

pub fn run() -> Result<(), Box<dyn Error>> {
    let args = CliOptions::parse();

    println!("outDir: {:?}", args.out_dir);

    Ok(())
}

#[derive(Parser)]
#[command(version, about, name = "yx_cli_rs")]
struct CliOptions {
    #[arg(short = 'd', long)]
    out_dir: Option<PathBuf>,

    #[arg(short = 'c', long)]
    config: Option<PathBuf>,

    #[arg(long, default_value_t = 1)]
    count: u8,

    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    Dev {
        #[arg(short = 'c', long)]
        config: Option<PathBuf>,
    },
}
