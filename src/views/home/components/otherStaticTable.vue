<style scoped>
    #static-table{
        padding:10px;
        width:100%;
    }

    #static-table {
        border: 1px solid #e6e4e4;
        width: 90%;

        padding:0;
        border-collapse: collapse;
        border-spacing: 0;
        margin: 0 auto;
    }

    #static-table tr {
        border: 1px solid #e6e4e4;
        padding: 5px;
    }

    #static-table th, #static-table td {
        border: 1px solid #e6e4e4;
        padding: 10px;
        text-align: center;
        color:#6d6d6d;
    }

    #static-table th {
        text-transform: uppercase;
        font-size: 14px;
        letter-spacing: 1px;
        background-color: #99d5cb;
        color:#fff;
    }
    #text-bottom{
        width:90%;
        margin:0 auto;
        margin-top:15px;
    }
</style>
<template>
    <div>
        <table id="static-table">
            <thead>
              <th style="width:40px;"></th>
              <th>今日</th>
              <th>本周</th>
              <th>本月</th>
            </thead>
            <tbody>
               <tr>
                   <td style="color:#b9b9b9;word-wrap: break-word;">营业额</td>
                   <td>￥255.3</td>
                   <td>￥255.3</td>
                   <td>￥255.3</td>
               </tr>
               <tr>
                   <td style="color:#b9b9b9;">考试人数</td>
                   <td>255.3人</td>
                   <td>255.3人</td>
                   <td>255.3人</td>
               </tr>
            </tbody>
        </table>
        <div id="text-bottom">
            <span style="font-size: 20px;color:#4faf76;font-weight: bold;">本月累计总考试时长:</span>
            <div style="float:right;margin-top: -5px;">
                <span style="color:#ff8319;font-size: 24px;font-weight: bold;">256.4</span><span style="color:#b8d2d8;">小时</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'otherStaticTable',
    mounted () {

    }
};
</script>