// 导入
const express = require('express')
const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
let { conMysql } = require('./mysql')

// 创建统一的返回报文对象
class Response {
  constructor(isSucceed, msg, code, data) {
    this.isSucceed = isSucceed
    this.msg = msg
    this.code = code
    this.data = data
  }
}

// 创建
const app = express()

// 处理 x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended:true
}));

// 处理 application/json
app.use(bodyParser.json())

// 处理 mutipart/form-data
app.use(multiparty())

// 设置跨域访问
const cors = require('cors')
app.use(cors())

// 测试接口能否正常调用
app.get('/info',(req, res) => {
  res.send('Hello shaoyahu !')
})

// 测试数据库连接的上不上
app.get('/getUser', (req, res) => {
  let sql = 'select * from t_sys_platform_user'
  conMysql(sql).then(result => {
    res.send(result)
  })
})

// 登录
app.post('/login', (req, res) => {
  let sql = `select * from t_sys_platform_user where name = '${req.query.username}'`
  conMysql(sql).then(result => {
    if (result[0]?.password === req.body.password) {
      let response = new Response(true, '登录成功', 200, result)
      res.send(response)
    } else {
      let response = new Response(false, '用户名或密码错误', 400)
      res.status(400).send(response)
    }
  }).catch(err => {
    res.status(500).send('数据库连接出错!')
  })
})

// 修改密码
app.post('/updatePassword', (req, res) => {
  let sql = `update userinfo set password = '${req.body.newPassword}' where username = '${req.body.username}'`
  conMysql(sql).then(result => {
    if (result.affectedRows == 1) {
      let response = new Response(true, '修改成功', 200, result)
      res.send(response)
    } else {
      let response = new Response(false, '修改失败,请稍后重试', 400)
      res.status(400).send(response)
    }
  }).catch(err => {
    res.status(500).send('数据库连接出错!')
  })
})

// 获取当前用户信息
app.get('/getUserInfo', (req, res) => {
  let sql = `select * from t_sys_platform_user where name = '${req.query.username}'`
  conMysql(sql).then(result => {
    let response = new Response(true, '获取成功', 200, result)
    res.send(response)
  }).catch(err => {
    res.status(500).send('数据库连接出错!')
  })
})
// 登录
app.get('/getTask', (req, res) => {
  let sql = `
SELECT 
    orderk.id AS orderId,
    orderk.order_no,
    orderP.order_num,
    IFNULL(planTask.taskStatus, 'Planned') AS taskStatus,
    DATE_FORMAT(orderk.add_end_time, '%Y-%m-%d') AS planEndDate,
    CASE 
        when IFNULL(ROUND((SUM(planTask.taskNum) / MAX(orderP.order_num)) * 100, 2), 0) >= 100 THEN 1
        WHEN orderk.add_end_time < CURDATE() AND DATEDIFF(CURDATE(), orderk.add_end_time) <= 3 THEN 2
        WHEN orderk.add_end_time < CURDATE() AND DATEDIFF(CURDATE(), orderk.add_end_time) > 3 THEN 3
        ELSE 1
    END AS backStatus,
    IFNULL(ROUND((SUM(planTask.taskNum) / MAX(orderP.order_num)) * 100, 2), 0) AS productionProgress
FROM 
    t_kdpro_order orderk
LEFT JOIN 
    t_kdpro_order_product orderP ON orderP.order_id = orderk.id
LEFT JOIN (
    SELECT 
        order_id,
        SUM(task_num) AS taskNum, 
        CASE 
            WHEN MAX(task_status) IN (4, 5) AND MIN(task_status) IN (4, 5) THEN 
                CASE 
                    WHEN MIN(task_status) = 5 THEN 'Finished'
                    ELSE 'Producing'
                END
            WHEN MAX(task_status) IN (1, 2, 3) AND MIN(task_status) IN (1, 2, 3) THEN 'Planned'
            ELSE 'Planned'
        END AS taskStatus
    FROM (
        SELECT 
            plan.order_id,
            task.status AS task_status,
            IFNULL(task.task_num, 0) AS task_num -- 确保 task_num 不为 NULL
        FROM 
            t_kdpro_plan plan
        LEFT JOIN 
            t_kdpro_task task ON task.plan_Id = plan.id
        WHERE 
            task.id IS NOT NULL
    ) AS subquery
    GROUP BY 
        order_id
) planTask ON planTask.order_id = orderP.order_id
WHERE 
    orderk.status IN (2, 3) AND orderk.del_flag = 0 
GROUP BY 
    orderk.id, orderk.order_no, orderP.order_num, planEndDate, planTask.taskStatus
ORDER BY 
    orderk.add_end_time ASC,planTask.taskStatus;
  `
  conMysql(sql).then(result => {
    console.log(result);
    if (result[0]?.password === req.body.password) {
      let response = new Response(true, '成功获取数据!', 200, result)
      res.send(response)
    } else {
      let response = new Response(false, '数据库异常', 400)
      res.status(400).send(response)
    }
  }).catch(err => {
    console.error(err); // 打印错误信息
    res.status(500).send('数据库连接出错!')
  })
})
// 启动
app.listen(3300, () => {
  console.log('express server running at http://127.0.0.1:' + 3300)
})
