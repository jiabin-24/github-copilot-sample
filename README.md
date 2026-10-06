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

当前版本**没有分页功能**，接口一次返回全部匹配订单。

支持以下可选筛选参数：

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `customerId` | 客户 ID | `CUST-002` |
| `status` | 订单状态 | `paid` |

可用状态：`pending`、`paid`、`shipped`、`completed`、`cancelled`。

示例：

```powershell
curl "http://localhost:3000/api/orders?customerId=CUST-002&status=paid"
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
  "total": 1
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
