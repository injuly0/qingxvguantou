
# Database Schema Design

此文档描述了未来后端实现的数据库结构设计。
它与前端 `types.ts` 中的 `MoodEntry` 接口直接映射。

## 1. Users Table (users)
存储用户账户信息。

| 字段名称 (Column) | 类型 (Type) | 说明 (Description) |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) (PK) | 用户唯一 ID (UUID) |
| `nickname` | VARCHAR(50) | 显示昵称 |
| `created_at` | DATETIME | 账户创建时间 |

## 2. Mood Entries Table (mood_entries)
存储情绪日记记录。核心业务表。
**对应前端接口**: `types.ts` -> `MoodEntry`

| 字段名称 (Column) | 类型 (Type) | 对应 TS 字段 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) (PK) | `id` | 唯一记录 ID (UUID) |
| `user_id` | VARCHAR(36) (FK) | - | 关联用户 ID |
| `created_at` | DATETIME | `createdAt` | 记录创建时间 |
| `mood_type` | VARCHAR(20) | `content.mood` | EUPHORIC, STABLE, 或 DEPRESSED |
| `event_text` | TEXT | `content.eventText` | 第一步：发生了什么（客观事实） |
| `happiness_source`| VARCHAR(20) | `content.source` | INTERNAL (内在) 或 EXTERNAL (外在) |
| `insight_text` | TEXT | `content.insightText` | 第三步：感悟/咒语 |
| `image_url` | VARCHAR(255)| `content.imageFile` | 图片的 URL 地址 (后端需处理上传) |
| `visual_config` | JSON | `visuals` | **关键**: 存储水晶球的视觉参数 (颜色, 种子, 样式) |
| `click_count` | INT | `stats.clickCount` | **关键**: 充能/点击次数 (决定树上高度) |
| `last_interacted_at`| DATETIME | `stats.lastInteractionAt`| 最后一次点击的时间 |

### `visual_config` JSON 示例
后端不需要关心颜色逻辑，直接存储前端生成的 JSON 即可：
```json
{
  "styleVariant": "nebula",
  "layoutSeed": 42,
  "colorTheme": {
    "border": "border-amber-200/50",
    "glow": "shadow-[...]",
    "nebula": "from-amber-..."
  }
}
```

## 3. User Traits Table (user_traits)
存储用户的性格力量特质 (Module B)。

| 字段名称 (Column) | 类型 (Type) | 说明 |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) (PK) | - |
| `user_id` | VARCHAR(36) (FK) | 关联用户 |
| `strength_id` | VARCHAR(50) | 力量 ID (如 'bravery', 'curiosity') |
| `type` | ENUM | 'CURRENT' (现有) 或 'IDEAL' (向往) |

## 后端迁移指南 (Migration Guide)
当你想从 LocalStorage 切换到真实数据库时：

1.  **建表**: 在你的数据库 (MySQL/PostgreSQL) 中创建上述表。
2.  **API 开发**: 开发一个后端 API (例如 `GET /api/entries`)，它需要返回与 `types.ts` 中 `MoodEntry` 结构一致的 JSON 数据。
3.  **前端替换**: 修改 `services/storageService.ts`，将 `localStorage.getItem` 替换为 `fetch('/api/entries')`。

前端的 UI 组件（水晶球、树、卡片）**不需要任何修改**。
