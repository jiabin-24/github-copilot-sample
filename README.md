# 订单查询 API 演示

这是一个 TypeScript + Node.js + Express 演示项目，提供订单查询接口。数据保存在内存中，方便后续练习接口改造。

## 启动

```powershell
npm install
npm run dev
```

服务默认运行在 `http://localhost:3000`，可通过 `PORT` 环境变量修改端口。

## 接口

### 查询订单

```http
GET /api/orders
```

接口会先按创建时间和订单 ID 降序稳定排序，再返回指定页的订单。

支持以下可选参数：

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `customerId` | 客户 ID | `CUST-002` |
| `status` | 订单状态 | `paid` |
| `page` | 页码，默认为 `1`，必须是正整数 | `2` |
| `pageSize` | 每页记录数，默认为 `20`，范围为 `1` 到 `100` | `10` |

可用状态：`pending`、`paid`、`shipped`、`completed`、`cancelled`。

非法分页参数会返回 `400`。超过最后一页时，`data` 为空数组，`total`
仍表示筛选后的订单总数。

示例：

```powershell
curl "http://localhost:3000/api/orders?customerId=CUST-002&status=paid&page=1&pageSize=10"
```

响应：

```json
{
  "data": [
    {
      "id": "ORD-1002",
      "customerId": "CUST-002",
      "customerName": "李娜",
      "status": "paid",
      "totalAmount": 399,
      "createdAt": "2026-10-02T11:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10
}
```

### 健康检查

```http
GET /health
```

## 验证

```powershell
npm run build
npm test
```
