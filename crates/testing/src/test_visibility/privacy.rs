mod outer {
    pub mod inner {
        pub fn f() {}
    }

    pub mod inner_p {
        pub fn f_p() {}
    }
}

pub use self::outer::inner;
pub use self::outer::inner_p::f_p;
