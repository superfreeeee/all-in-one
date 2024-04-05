package main

import (
	"errors"
	"fmt"

	"example.com/test_gorm_mysql/dao"
	mysqlDriver "github.com/go-sql-driver/mysql"
	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

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
	return gorm.Open(mysql.Open(dsn), &gorm.Config{
		/*
			查看 sql 日志
		*/
		Logger: logger.Default.LogMode(logger.Info),
	})
}

var productMapper *dao.ProductMapper

func initProductMapper(db *gorm.DB) {
	productMapper = dao.NewProductMapper(db)
}

func main() {
	config, err := readAppConfig("config.yaml")
	RaiseOnErr(err)

	db, err := createConnection(config)
	RaiseOnErr(err)

	fmt.Println("Create connection success.")

	initProductMapper(db)

	fmt.Println("initProductMapper.")

	// Migrate the schema
	// db.AutoMigrate(&dao.Product{})

	// 插入记录 => 对应 insert 语句
	// Create
	// productMapper.Create(&dao.Product{Code: "D42", Price: 0})
	// productMapper.Create(&dao.Product{Code: "D42", Price: 1})
	// productMapper.Create(&dao.Product{Code: "D42", Price: 2})
	// productMapper.Create(&dao.Product{Code: "D43", Price: 20})
	// productMapper.Create(&dao.Product{Code: "D44", Price: 20})
	// productMapper.Create(&dao.Product{Code: "D45", Price: 20})

	// 查询语句 => 对应 select 语句
	// Query
	// printProductResult(productMapper.QueryById(1))
	// printProductResult(productMapper.QueryById(10))
	// printProductResult(productMapper.QueryById(2))
	// printProductResult(productMapper.QueryById(4))
	// printProductsResult(productMapper.QueryByCode("D42"))
	// printProductsResult(productMapper.QueryByCode("D43"))
	// printProductsResult(productMapper.QueryByCode("D45"))
	// printProductsResult(productMapper.QueryByCode("D48"))

	// 修改语句 => 对应 update 语句
	// productMapper.UpdatePriceById(3, 202)

	// Delete - delete product
	// productMapper.DeleteById(17)
}

// utils
func RaiseOnErr(err error) {
	if err != nil {
		panic(err)
	}
}

func handleSQLError(err error) {
	fmt.Println(err)

	if mysqlErr, ok := err.(*mysqlDriver.MySQLError); ok {
		switch mysqlErr.Number {
		case 1146:
			fmt.Println("table no exists")
			return
		}
	}
}

func printProductResult(p *dao.Product, err error) {
	fmt.Println()
	fmt.Println("> printProductResult")
	if err != nil {
		handleSQLError(err)
		return
	}

	p.Show()
}

func printProductsResult(ps []*dao.Product, err error) {
	fmt.Println()
	fmt.Println("> printProductsResult")
	if err != nil {
		handleSQLError(err)
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
