## 数据存储格式设计

前期存储采用key-value型的leveldb数据库,以减轻维护负担并获得出色的读写速度.

#### 位置存储
位置信息数据库中存储<地点, 商家>

```json
    $location: []
```

#### 商家信息存储
商家信息根据不同网站给出的信息整合,按网站划分

```json
	$name: [
    	{
        	$name: $proxy_1,
            $ann:,
            $attr:,
            $food: [
            	{
                	$name: ,
                    $price: ,
                    $other: ,
                    ...
                },
                { ... },
                ...
            ],
            $other: ...
        },
        {
        	$name: $proxy_2,
            ...
        },
        ...
    ]
```