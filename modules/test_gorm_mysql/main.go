package main

import (
	"errors"
	"fmt"

	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Code  string
	Price uint
}

// 实现 TableName 方法指定表名
func (Product) TableName() string {
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

type AppConfig struct {
	Database struct {
		Host     string `mapstructure:"host"`
		Port     int    `mapstructure:"port"`
		Username string `mapstructure:"username"`
		Password string `mapstructure:"password"`
		DbName   string `mapstructure:"dbname"`
	} `mapstructure:"database"`
}

func readAppConfig(filename string) (*AppConfig, error) {
	viper.SetConfigFile("config.yaml")
	err := viper.ReadInConfig()
	if err != nil {
		return nil, errors.New(fmt.Sprintf("Error reading config file: %s", err))
	}

	var config AppConfig
	if err := viper.Unmarshal(&config); err != nil {
		return nil, errors.New(fmt.Sprintf("Error unmarshaling config: %s", err))
	}

	return &config, nil
}

var _db *gorm.DB

func createConnection(config *AppConfig) (db *gorm.DB, err error) {
	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	// dsn := "dev:123456789@tcp(127.0.0.1:3306)/test_go?charset=utf8mb4&parseTime=True&loc=Local"
	dsn := fmt.Sprintf("%v:%v@/%v?charset=utf8mb4&parseTime=True&loc=Local", config.Database.Username, config.Database.Password, config.Database.DbName)
	return gorm.Open(mysql.Open(dsn), &gorm.Config{})
}

func main() {
	config, err := readAppConfig("config.yaml")
	RaiseOnErr(err)

	db, err := createConnection(config)
	RaiseOnErr(err)

	_db = db
	fmt.Println("Create connection success.")

	// Migrate the schema
	db.AutoMigrate(&Product{})

	// 插入记录 => 对应 insert 语句
	// Create
	// CreateProduct(&Product{Code: "D42", Price: 0})
	// CreateProduct(&Product{Code: "D42", Price: 1})
	// CreateProduct(&Product{Code: "D42", Price: 2})
	// CreateProduct(&Product{Code: "D43", Price: 20})
	// CreateProduct(&Product{Code: "D44", Price: 20})
	// CreateProduct(&Product{Code: "D45", Price: 20})

	// 查询语句 => 对应 select 语句
	// Query
	printProductResult(QueryProductById(1))
	// printProductResult(QueryProductById(10))
	// printProductResult(QueryProductById(2))
	// printProductResult(QueryProductById(4))
	printProductsResult(QueryProductsByCode("D42"))
	printProductsResult(QueryProductsByCode("D43"))
	// printProductsResult(QueryProductsByCode("D45"))
	// printProductsResult(QueryProductsByCode("D48"))

	// 修改语句 => 对应 update 语句
	// Update - update product's price to 200
	// db.Model(&product).Update("Price", 200)
	// Update - update multiple fields
	// db.Model(&product).Updates(Product{Price: 200, Code: "F42"}) // non-zero fields
	// db.Model(&product).Updates(map[string]interface{}{"Price": 200, "Code": "F42"})

	// Delete - delete product
	// db.Delete(&product, 1)
}

// utils
func RaiseOnErr(err error) {
	if err != nil {
		panic(err)
	}
}

func printProductResult(p *Product, err error) {
	fmt.Println()
	fmt.Println("> printProductResult")
	if err != nil {
		fmt.Println(err)
		return
	}

	p.Show()
}

func printProductsResult(ps []*Product, err error) {
	fmt.Println()
	fmt.Println("> printProductsResult")
	if err != nil {
		fmt.Println(err)
		return
	}

	if len(ps) == 0 {
		fmt.Println("products is empty")
		return
	}

	for _, p := range ps {
		p.Show()
	}
}

// dao functions
func CreateProduct(p *Product) {
	_db.Create(p)
}

func QueryProductById(id uint) (*Product, error) {
	var product Product
	result := _db.First(&product, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &product, nil
}

func QueryProductsByCode(code string) ([]*Product, error) {
	var products []*Product
	result := _db.Find(&products, "code = ?", code)
	if result.Error != nil {
		return nil, result.Error
	}
	return products, nil
}
