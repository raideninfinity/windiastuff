var currentRow;
var flameRow;
var starRows = [];
var stat1nodes = [];
var stat2nodes = [];
var stat3nodes = [];
var eq_type = 0;
var stars = 0;
var overall = false;
var level = 0;
var stat1 = 0;
var stat2 = 0;
var atk = 0;
var flame1 = 0;
var flame2 = 0;
var lock = false;

$(document).ready(function() {
    $("#main").append(`
      <p>
        <input type="radio" id="eq_type_1" name="eq_type" value="0" checked>Armor
        <input type="radio" id="eq_type_2" name="eq_type" value="1">Weapon
        <input type="radio" id="eq_type_3" name="eq_type" value="2">Superior
        <input type="radio" id="eq_type_4" name="eq_type" value="3" disabled>Tyrant Cape (Not implemented!)
        <!--<input type="checkbox" id="check0" name="c_superior" value="superior">Superior-->
      </p>  
      <table id="table1">
      </table>
      <p>
      <p>How to use: Choose equipment type, choose level, enter stats, then enter flame.
      <p>Choose star amount if reversing to find base stat.</p>
      <p>+ Flame: Adds max flame to the base stat.</p>
      <p>- Flame: Removes flame to obtain base stat.</p>
      <a href="index.html">Back</a></p>`);
    $("#eq_type_1").change(radioChange);
    $("#eq_type_2").change(radioChange);
    $("#eq_type_3").change(radioChange);
    $("#eq_type_4").change(radioChange);
    $("#check0").change(superiorChange);
    //Build Table
    $("#table1").append("<tr><th></th><th>Stat1</th><th>Stat2</th><th>Atk</th><th>Stars</th></tr>");
    let row1 = document.createElement("tr");
    row1.innerHTML = "<td>Current</td><td></td><td></td><td></td><td></td>";
    currentRow = row1;
    $("#table1").append(row1);
    row2 = document.createElement("tr");
    row2.innerHTML = "<td>Flame</td><td></td><td></td><td></td><td></td>";
    flameRow = row2;
    $("#table1").append(row2);   
    for(let i = 0; i < 16; i++){
      let row = document.createElement("tr");
      let row_id = i;
      row.innerHTML = `<td>${row_id}</td><td></td><td></td><td></td><td></td>`;
      starRows.push(row);
      $("#table1").append(row);
    }
    //Add Components
    currentRow.childNodes[1].innerHTML = `<input type="number" id="numeric1" value="0" style="width: 64px;" min="0" max="10000">`;
    currentRow.childNodes[2].innerHTML = `<input type="number" id="numeric2" value="0" style="width: 64px;" min="0" max="10000">`;
    currentRow.childNodes[3].innerHTML = `<input type="number" id="numeric3" value="0" style="width: 64px;" min="0" max="10000">`;
    flameRow.childNodes[3].innerHTML = `<input type="checkbox" id="check1" name="c_overall" value="overall">Overall`;
    flameRow.childNodes[3].style= `text-align: left;`
    //Add Select Stars
    let starSel = document.createElement('select');
    starSel.name = "stars";
    starSel.id = "select1";
    starSel.style = "width: 80px;";
    for(let i = 0; i < 16; i++){
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = (i == 0) ? "None" : i;
      if (i == 0) opt.selected = true;
      starSel.appendChild(opt);
    }
    currentRow.childNodes[4].append(starSel);
    //Add Select Flame 1
    let flame1Sel = document.createElement('select');
    flame1Sel.name = "flame1";
    flame1Sel.id = "select2";
    flame1Sel.style = "width: 80px;";
    for(let i = 0; i < 11; i++){
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = i;
      if (i == 0) opt.selected = true;
      flame1Sel.appendChild(opt);
    }
    flameRow.childNodes[1].append(flame1Sel);   
    //Add Select Flame 2
    let flame2Sel = document.createElement('select');
    flame2Sel.name = "flame2";
    flame2Sel.id = "select3";
    flame2Sel.style = "width: 80px;";
    for(let i = 0; i < 11; i++){
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = i;
      if (i == 0) opt.selected = true;
      flame2Sel.appendChild(opt);
    }
    flameRow.childNodes[2].append(flame2Sel);    
    //Add Level Select
    let levelSel = document.createElement('select');
    levelSel.name = "level";
    levelSel.id = "select4";
    levelSel.style = "width: 80px;";
    for(let i = 0; i < 13; i++){
      let opt = document.createElement("option");
      opt.value = i * 20;
      opt.innerHTML = `Lv. ${opt.value}+`;
      if (i == 0) opt.selected = true;
      levelSel.appendChild(opt);
    }   
    flameRow.childNodes[4].append(levelSel);       
    //Populate Numbers
    for(let i = 0; i < starRows.length; i++){
      let row = starRows[i];
      let node1 = row.childNodes[1];
      node1.innerText = "0";
      stat1nodes.push(node1);
      let node2 = row.childNodes[2];
      node2.innerText = "0";
      stat2nodes.push(node2);
      let node3 = row.childNodes[3];
      node3.innerText = "0";
      stat3nodes.push(node3);  
      if (i == 0){
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = '+ Flame';
        btn.onclick = maxFlames;
        row.childNodes[4].append(btn);
      }
      else if (i == 1){
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = '- Flame';
        btn.onclick = removeFlames;
        row.childNodes[4].append(btn);
      }
    }
    //Set Listeners
    currentRow.childNodes[1].firstChild.addEventListener("change", numChange);
    currentRow.childNodes[2].firstChild.addEventListener("change", numChange);
    currentRow.childNodes[3].firstChild.addEventListener("change", numChange);
    currentRow.childNodes[4].firstChild.addEventListener("change", starChange);
    flameRow.childNodes[1].firstChild.addEventListener("change", flameChange);
    flameRow.childNodes[2].firstChild.addEventListener("change", flameChange);
    flameRow.childNodes[3].firstChild.addEventListener("change", overallChange);
    flameRow.childNodes[4].firstChild.addEventListener("change", levelChange);
});

function maxFlames(){
  if (lock) return;
  lock = true;  
  let f1 = flameRow.childNodes[1].firstChild;
  let f2 = flameRow.childNodes[2].firstChild;
  let s1 = currentRow.childNodes[1].firstChild;
  let s2 = currentRow.childNodes[2].firstChild;
  if (f1.selectedIndex == 0 && parseInt(s1.value) > 0){
    f1.selectedIndex = 10;
    let v1 = parseInt(s1.value) + parseInt(f1.value);
    s1.value = v1;
  }
  if (f2.selectedIndex == 0 && parseInt(s2.value) > 0){
    f2.selectedIndex = 10;
    let v2 = parseInt(s2.value) + parseInt(f2.value);
    s2.value = v2;
  }
  flame1 = parseInt(f1.value);
  flame2 = parseInt(f2.value);
  stat1 = parseInt(s1.value);
  stat2 = parseInt(s2.value);
  recalcStats();
  lock = false;
}

function removeFlames(){
  if (lock) return;
  lock = true;  
  let f1 = flameRow.childNodes[1].firstChild;
  let f2 = flameRow.childNodes[2].firstChild;
  let s1 = currentRow.childNodes[1].firstChild;
  let s2 = currentRow.childNodes[2].firstChild;
  if (f1.selectedIndex > 0 && parseInt(s1.value) >= parseInt(f1.value)){
    let v1 = parseInt(s1.value) - parseInt(f1.value);
    s1.value = v1;
    f1.selectedIndex = 0;
  }
  if (f2.selectedIndex > 0 && parseInt(s2.value) >= parseInt(f2.value)){
    let v2 = parseInt(s2.value) - parseInt(f2.value);
    s2.value = v2;
    f2.selectedIndex = 0;
  }
  flame1 = parseInt(f1.value);
  flame2 = parseInt(f2.value);
  stat1 = parseInt(s1.value);
  stat2 = parseInt(s2.value);
  recalcStats();
  lock = false;
}

function radioChange(){
  if (lock) return;
  lock = true;
  eq_type = this.value;
  recalcStats();
  lock = false;
};
    
function numChange(){
  if (lock) return;
  lock = true;
  stat1 = parseInt(currentRow.childNodes[1].firstChild.value);
  stat2 = parseInt(currentRow.childNodes[2].firstChild.value);
  atk = parseInt(currentRow.childNodes[3].firstChild.value);
  recalcStats();
  lock = false;  
}

function starChange(){
  if (lock) return;
  lock = true;  
  stars = parseInt(currentRow.childNodes[4].firstChild.value);
  recalcStats();
  lock = false;  
}

function flameChange(){
  if (lock) return;
  lock = true; 
  procFlameChange();
  recalcStats();
  lock = false;    
}

function procFlameChange(){
  flame1 = parseInt(flameRow.childNodes[1].firstChild.value);
  flame2 = parseInt(flameRow.childNodes[2].firstChild.value);
}

function levelChange(){
  if (lock) return;
  lock = true; 
  level = parseInt(flameRow.childNodes[4].firstChild.value);
  recalcFlame(flameRow.childNodes[1].firstChild);
  recalcFlame(flameRow.childNodes[2].firstChild);
  procFlameChange();
  recalcStats();
  lock = false;   
}

function overallChange(){
  if (lock) return;
  lock = true; 
  overall = flameRow.childNodes[3].firstChild.checked;
  recalcFlame(flameRow.childNodes[1].firstChild);
  recalcFlame(flameRow.childNodes[2].firstChild);
  procFlameChange();
  recalcStats();
  lock = false;    
}

function superiorChange(){
  if (lock) return;
  lock = true; 
  superior = this.checked;
  recalcStats();
  lock = false;    
}

function recalcFlame(sel){
  let value = level / 20;
  if (overall) value *= 2;
  value += 1;  
  for(let i = 0; i < 11; i++){
    sel.options[i].value = i * value;
    sel.options[i].innerText = i * value;
  }
}

function get_stat_mult(){
  if (eq_type == 0) //armor
    return 3.5;
  else if (eq_type == 1) //weapon
    return 3.5;
  else if (eq_type == 2) //superior
    return 5.0;
  else if (eq_type == 3) //tyrant cape
    return 5.0;
  else  
    return 0;
}

function get_atk_mult(){
  if (eq_type == 0) //armor
    return 0;
  else if (eq_type == 1) //weapon
    return 2.9;
  else if (eq_type == 2) //superior
    return 2.5;
  else if (eq_type == 3) //tyrant cape
    return 2.5;
  else  
    return 0;
}

var atk_top = [0, 75, 75, 25, 75, 15, 25, 75, 75, 25, 15, 75, 25, 75, 75, 5];
var atk_btm = [0, 76, 77, 26, 79, 16, 27, 82, 83, 28, 17, 86, 29, 88, 89, 6];

function reverse_atk(atk, atk_mult, stars){
  if (stars == 0) return atk;
  let target_base = 0;
  if (atk_mult == 0){
    if (stars >= 7) target_base = atk * 5 / 6;  
    else if (stars == 6) target_base = atk * 25 / 28;
    else if (stars == 5) target_base = atk * 50 / 53;
    else if (stars == 4) target_base = atk * 50 / 51;
    else return atk;
    target_base = Math.ceil(target_base);
    //verification
    let attempts = 0;
    while(true){
      attempts++;
      let a = target_base;
      if (stars >= 4) a += Math.floor(target_base / 50);
      if (stars >= 5) a += Math.floor(2 * target_base / 50);
      if (stars >= 6) a += Math.floor(3 * target_base / 50);
      if (stars >= 7) a += Math.floor(4 * target_base / 50);
      a = Math.floor(a);
      if (a < atk) target_base++;
      else if (a > atk) target_base--;
      else break;
      if (attempts > 10) break;
    }
    //return
    return target_base;
  }else{
    target_base = atk - (stars * atk_mult * level / 90)
    target_base = target_base * atk_top[stars] / atk_btm[stars];
    target_base = Math.ceil(target_base);
    let attempts = 0;
    while(true){
      attempts++;
      let a = target_base + (target_base / 5.0) * (stars / 15) + atk_mult * (level / 90) * stars;
      a = Math.floor(a);
      if (a < atk) target_base++;
      else if (a > atk) target_base--;
      else break;
      if (attempts > 10) break;
    }     
    return target_base;
  }
}

var stat_top = [0, 225, 225, 75, 225, 45, 75, 225, 225, 25, 45, 225, 75, 225, 225, 15];
var stat_btm = [0, 227, 229, 77, 233, 47, 79, 239, 241, 27, 49, 247, 83, 251, 253, 17];

function reverse_stat(stat, stat_mult, stars){
  if (stars == 0 || stat == 0) return stat;
  let target_base = 0;  
  target_base = stat - (stars * stat_mult * level / 90);
  target_base = target_base * stat_top[stars] / stat_btm[stars];
  target_base = Math.ceil(target_base);
  let attempts = 0;
  while(true){
    attempts++;
    let a = target_base + (target_base / 7.5) * (stars / 15) + stat_mult * (level / 90) * stars;
    a = Math.floor(a);
    if (a < stat) target_base++;
    else if (a > stat) target_base--;
    else break;
    console.log(`a ${a} stat ${stat} target_base ${target_base}`);
    if (attempts > 10) break;
  }  
  return target_base;
}

function recalcStats(){
  //console.log(`stat1 ${stat1} stat2 ${stat2} atk ${atk} level ${level} flame1 ${flame1} flame2 ${flame2} stars ${stars}`);
  let base_stat1 = stat1 - flame1;
  let base_stat2 = stat2 - flame2;
  let base_atk = atk;
  
  let stat_mult = get_stat_mult();
  let atk_mult = get_atk_mult();
  
  //reverse stats
  base_stat1 = reverse_stat(base_stat1, stat_mult, stars);
  base_stat2 = reverse_stat(base_stat2, stat_mult, stars);
  base_atk = reverse_atk(base_atk, atk_mult, stars);
  
  for(let i = 0; i < 16; i++){
    let s1 = base_stat1 + (base_stat1 / 7.5) * (i / 15) + stat_mult * (level / 90) * i + flame1;
    let s2 = base_stat2 + (base_stat2 / 7.5) * (i / 15) + stat_mult * (level / 90) * i + flame2;
    let s3 = base_atk;
    
    if (atk_mult == 0)
    {
      if (i >= 4) s3 += Math.floor(base_atk / 50);
      if (i >= 5) s3 += Math.floor(2 * base_atk / 50);
      if (i >= 6) s3 += Math.floor(3 * base_atk / 50);
      if (i >= 7) s3 += Math.floor(4 * base_atk / 50);
    }
    else
      s3 = base_atk + (base_atk / 5.0) * (i / 15) + atk_mult * (level / 90) * i;
    
    if (base_stat1 <= 0) s1 = flame1;
    if (base_stat2 <= 0) s2 = flame2;
    if (base_atk <= 0) s3 = 0;
    stat1nodes[i].innerText = Math.floor(s1);
    stat2nodes[i].innerText = Math.floor(s2);
    stat3nodes[i].innerText = Math.floor(s3);
  }
}

