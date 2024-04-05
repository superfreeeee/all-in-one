package dao

import (
	"fmt"

	"gorm.io/gorm"
)

/*
==============================
实体类型定义
==============================
*/
type Product struct {
	gorm.Model
	/*
		column name
		https://gorm.io/docs/conventions.html#Column-Name
	*/
	Code  string
	Price uint
}

/*
table name: 实现 TableName 方法指定表名
https://gorm.io/docs/conventions.html#Pluralized-Table-Name
*/
func (*Product) TableName() string {
	return "c_products"
}

func (p *Product) Show() {
	fmt.Println("==============================")
	fmt.Printf("> Product, id=%v\n", p.ID)
	fmt.Printf("Code      : %v\n", p.Code)
	fmt.Printf("Price     : %v\n", p.Price)
	fmt.Printf("CreatedAt : %v\n", p.CreatedAt)
	fmt.Printf("UpdatedAt : %v\n", p.UpdatedAt)
}

/*
==============================
DAO 层定义
==============================
*/
type ProductMapper struct {
	db *gorm.DB
}

func NewProductMapper(db *gorm.DB) *ProductMapper {
	return &ProductMapper{db}
}

/*
Create => INSERT
https://gorm.io/docs/create.html
*/
func (m *ProductMapper) Create(p *Product) error {
	tx := m.db.Create(p)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

/*
Query => SELECT
https://gorm.io/docs/query.html
*/
func (m *ProductMapper) QueryById(id uint) (*Product, error) {
	var product Product
	tx := m.db.First(&product, id)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return &product, nil
}

func (m *ProductMapper) QueryByCode(code string) ([]*Product, error) {
	var products []*Product
	tx := m.db.Find(&products, "code = ?", code)
	if tx.Error != nil {
		return nil, tx.Error
	}
	return products, nil
}

/*
Update => UPDATE
https://gorm.io/docs/update.html
*/
func (m *ProductMapper) UpdatePriceById(id uint, price uint) error {
	model := &Product{}
	model.ID = id
	// 指定其他 field 无效
	model.Code = "D1"
	model.Price = 200
	/*
		Where 指定 WHERE 语句
		Select 指定操作列
		Omit 与 Select 相反，排除操作列
		Updates 使用对象更新
		Update 更新单列
	*/
	tx := m.db.Model(model).Where("price = ?", 200).Select("price").Updates(Product{Price: price})
	fmt.Println("RowsAffected =", tx.RowsAffected)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

/*
Delete => DELETE
https://gorm.io/docs/delete.html
*/
func (m *ProductMapper) DeleteById(id uint) error {
	tx := m.db.Delete(&Product{}, id)
	fmt.Println("RowsAffected =", tx.RowsAffected)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}
