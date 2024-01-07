mod outer {
    pub mod inner {
        #[allow(dead_code)]
        pub fn f() {}
    }

    pub mod inner_p {
        #[allow(dead_code)]
        pub fn f_p() {}
    }
}

pub use self::outer::inner;
pub use self::outer::inner_p::f_p;
