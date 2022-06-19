var inputRow;
var actionRow;
var resultsRow;

$(document).ready(function() {
    $("#main").append(`
      <table id="table1">
      </table>
      <p></p>
      <p>Last Updated: 19 June 2022 8:51 AM GMT+8</p>
      <a href="index.html">Back</a></p>
    `);
    $("#table1").append("<tr><th>Base Stat</th><th>Base Atk</th><th></th><th>Goal Stat</th><th>Goal Atk</th></tr>");
    let row1 = document.createElement("tr");
    row1.innerHTML = "<td></td><td></td><td></td><td></td><td></td>";
    inputRow = row1; 
    $("#table1").append(row1);
    inputRow.childNodes[0].innerHTML = `<input type="number" id="numeric1" value="0" style="width: 64px;" min="0" max="10000">`;
    inputRow.childNodes[1].innerHTML = `<input type="number" id="numeric2" value="0" style="width: 64px;" min="0" max="10000">`;
    inputRow.childNodes[2].innerHTML = `<input type="checkbox" id="check1">Level 5`;
    inputRow.childNodes[2].style = `text-align: left`;
    inputRow.childNodes[3].innerHTML = `<input type="number" id="numeric3" value="0" style="width: 64px;" min="0" max="10000" disabled>`;
    inputRow.childNodes[4].innerHTML = `<input type="number" id="numeric4" value="0" style="width: 64px;" min="0" max="10000" disabled>`;
    let row2 = document.createElement("tr");
    row2.innerHTML = "<td></td><td></td><td colspan=2></td><td></td>";
    actionRow = row2; 
    $("#table1").append(row2);  
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.disabled = true;
    btn.innerHTML = 'Simulate';
    btn.onclick = simulateLeveling;
    actionRow.childNodes[0].append(btn);
    btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = 'Sim. Once';
    btn.onclick = simulateOnce;
    actionRow.childNodes[1].append(btn);
    btn = document.createElement('button');
    actionRow.childNodes[2].innerHTML = `<input type="checkbox" id="check2" checked disabled>Percentile`;
    actionRow.childNodes[2].style = `text-align: left`;
    actionRow.childNodes[3].innerHTML = `<input type="number" id="numeric5" value="50" style="width: 64px;" min="5" max="95" step="5"  disabled>`;
    let row3 = document.createElement("tr");
    row3.innerHTML = `<td colspan="5"><div id="div-result" style="min-height: 400px; max-height: 400px; overflow-y: scroll; text-align: left; padding: 4px; font-family: Courier; font-size: 0.8em"></div></td>`;
    resultsRow = row3;
    $("#table1").append(row3);  
    $("#div-result").innerHTML = ``;
});

function clearResult(){
  $("#div-result").empty();
}

function simulateLeveling(){
  clearResult();
  
}

function simulateOnce(){
  clearResult();
  let str = "";
  let base_stat = parseInt(inputRow.childNodes[0].childNodes[0].value);
  let base_att = parseInt(inputRow.childNodes[1].childNodes[0].value);
  let level5 = inputRow.childNodes[2].childNodes[0].checked;
  if (base_stat <= 0 && base_att <= 0) str = `Please enter a valid stat and/or attack value.`;
  else{
    let level = level5 ? 5 : 1;
    str += `Level ${level} Base: Stat ${base_stat}, Att ${base_att}<br>`;
    str += `<b>Average:</b><br>`;
    let avg_stat = 0, avg_att = 0;
    if (!level5){
      avg_stat = getAvg(base_stat, false, 5);
      avg_att = getAvg(base_att, true, 5);
      str += `Level 5 - Stat ${avg_stat}, Att ${avg_att}<br>`;
    }
    avg_stat = getAvg(base_stat, false, level5 ? 3 : 7);
    avg_att = getAvg(base_att, true, level5 ? 3 : 7);
    str += `Level 7 - Stat ${avg_stat}, Att ${avg_att}<br>`;   
    str += `<b>Highest possible stats:</b><br>`;
    let max_stat = 0, max_att = 0;
    if (!level5){
      max_stat = getMax(base_stat, false, 5);
      max_att = getMax(base_att, true, 5);
      str += `Level 5 - Stat ${max_stat}, Att ${max_att}<br>`;
    }
    max_stat = getMax(base_stat, false, level5 ? 3 : 7);
    max_att = getMax(base_att, true, level5 ? 3 : 7);
    str += `Level 7 - Stat ${max_stat}, Att ${max_att}<br>`;
    str += `<br>`;
    str += `<b>Simulation</b><br>`;
    let stat = base_stat;
    let att = base_att;
    for(let i = level+1; i <= 7; i++){
      str += `Lv. ${i}<br>`;
      let stat_max = getMax(stat, false, 2) - stat;
      let att_max = getMax(att, true, 2) - att;
      let prev_stat = stat;
      stat += getUnitStatUpgrade(stat, false);
      let prev_att = att;
      att += getUnitStatUpgrade(att, true);
      let stat_gain = stat - prev_stat;
      let att_gain = att - prev_att;
      if (stat > 0)
        str += `- Stat +${stat_gain} (max: ${stat_max}) (cur: ${stat})<br>`;
      if (att > 0)
        str += `- Att. +${att_gain} (max: ${att_max}) (cur: ${att})<br>`;
    }
    str += `<br>`;
    str += `<b>Final Result</b><br>`;
    str += `Stat ${stat}, Att ${att}<br>`;
  }
  $("#div-result").append(str);
}

function getUnitStatUpgrade(base, isAtt){
  if (base <= 0) return 0;
  let stat_modifier = isAtt ? 4.2 : 2.1;
  let max_result = (1 + (base / (stat_modifier * 1.05)))
  let result = 0;
  while(true){
    result = randomizeStatUpgrade(parseInt(max_result));
    if (result > 0) break;
  }
  return result;
}

function randomizeStatUpgrade(max){
  let limit = Math.min(max, 10000);
  let poolCount = (limit * (limit + 1) / 2) + limit
  let rnd = Math.floor(Math.random() * poolCount);
  let stat = 0;
  if (rnd >= limit){
    rnd -= limit;
    stat = 1 + Math.floor((-1 + Math.sqrt((8.0 * rnd) + 1)) / 2)
  }
  return stat;
}

function getMax(base, isAtt, level){
  if (base <= 0) return 0;
  let stat_modifier = isAtt ? 4.2 : 2.1;
  let stat = base;
  for(let i = 1; i < level; i++){
    let max_result = (1 + (stat / (stat_modifier * 1.05)));
    stat += parseInt(max_result) + 1;
  }
  return stat;
}

function getAvg(base, isAtt, level){
  if (base <= 0) return 0;
  let arr = [];
  for(let i = 0; i < 10000; i++){
    let stat = base;
    for(let i = 1; i < level; i++){
      result = getUnitStatUpgrade(stat, isAtt);
      stat += parseInt(result);
    }
    arr.push(stat);
  }
  total = arr.reduce((partialSum, a) => partialSum + a, 0);
  return parseInt(total / 10000);
}


















