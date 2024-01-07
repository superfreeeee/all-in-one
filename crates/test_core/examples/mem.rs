use std::mem::size_of;

fn inner_alloc(alloc_size: usize) -> Option<*const u8> {
    let cursor: usize = 0xffffffff;
    println!("cursor          : {:#x}", cursor);

    let align_mask = !(size_of::<usize>() - 1);
    println!("size_of unsize  : {:#x}", size_of::<usize>());
    println!("unsize max      : {:#x}", !(0 as usize));
    println!("align_mask      : {:#x}", align_mask);

    let next_ptr = cursor.checked_sub(alloc_size)?;
    println!("next_ptr        : {:#x}", align_mask);
    let next_ptr = next_ptr & align_mask;
    println!("next_ptr masked : {:#x}", align_mask);

    Some(next_ptr as *const u8)
}

struct Item {
    id: u32,
    name: String,
}

fn test_alloc_size_count() {
    println!("> test_alloc_size_count");

    let allocated = inner_alloc(size_of::<Item>());
    println!("allocated: {:?}", allocated)
}

fn main() {
    test_alloc_size_count();
}
