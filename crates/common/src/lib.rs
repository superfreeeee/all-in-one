use std::error::Error;

pub type AnyError = Box<dyn Error>;

pub mod path_utils;
