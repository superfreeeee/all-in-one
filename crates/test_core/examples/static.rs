static mut STATIC_NUM: u32 = 1;

fn main() {
    unsafe {
        STATIC_NUM = 2;
        println!("STATIC_NUM = {}", STATIC_NUM);
    }
}
