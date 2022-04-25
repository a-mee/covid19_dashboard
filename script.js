var parsedVaccines;
var parsedCases;
        
// Jason data 1        
var xmlhttp1 = new XMLHttpRequest();
var url = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=Week,TotalweeklyVaccines,Moderna,Pfizer,Janssen,AstraZeneca,FullyCum_Age10to19,FullyCum_Age20to29,FullyCum_Age30to39,FullyCum_Age40to49,FullyCum_Age50to59,FullyCum_Age60to69,FullyCum_Age70to79,FullyCum_80_,FullyPer_Age10to19,FullyPer_Age20to29,FullyPer_Age30to39,FullyPer_Age40to49,FullyPer_Age50to59,FullyPer_Age60to69,FullyPer_Age70to79,FullyPer_80_&outSR=4326&f=json";

xmlhttp1.onreadystatechange = function() {
    if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
        parsedVaccines = JSON.parse(xmlhttp1.responseText);
        weekDrop(parsedVaccines);
        currentWeek(parsedVaccines);
    }
};
xmlhttp1.open("GET", url, true);
xmlhttp1.send();
        
        
// Jason data 2
var xmlhttp2 = new XMLHttpRequest();
var url = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=CountyName,PopulationCensus16,ConfirmedCovidCases,PopulationProportionCovidCases&outSR=4326&f=json";

xmlhttp2.onreadystatechange = function() {
    if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
        parsedCases = JSON.parse(xmlhttp2.responseText);
        countyDropMinMax(parsedCases);
    }
};
xmlhttp2.open("GET", url, true);
xmlhttp2.send();
        
        
        
function vaccineInfo(obj, week){
    var vaccines = obj.features;
            
    var total_2021 = 0;
            
    for (var i=1; i <vaccines.length; i++){
        var info = vaccines[i].attributes;
                
        var week_name = info.Week;
        total_2021 += info.TotalweeklyVaccines;
                
        if (week_name == week){
            var total_weekly = info.TotalweeklyVaccines;
            var moderna = info.Moderna;
            var pfizer = info.Pfizer;
            var janssen = info.Janssen;
            var astrazeneca = info.AstraZeneca;
                
            var cum_10to19 = info.FullyCum_Age10to19;
            var cum_20to29 = info.FullyCum_Age20to29;
            var cum_30to39 = info.FullyCum_Age30to39;
            var cum_40to49 = info.FullyCum_Age40to49;
            var cum_50to59 = info.FullyCum_Age50to59;
            var cum_60to69 = info.FullyCum_Age60to69;
            var cum_70to79 = info.FullyCum_Age70to79;
            var cum_80 = info.FullyCum_80_;
            
            var per_10to19 = (info.FullyPer_Age10to19 * 100).toFixed(2);
            var per_20to29 = (info.FullyPer_Age20to29 * 100).toFixed(2);
            var per_30to39 = (info.FullyPer_Age30to39 * 100).toFixed(2);
            var per_40to49 = (info.FullyPer_Age40to49 * 100).toFixed(2);
            var per_50to59 = (info.FullyPer_Age50to59 * 100).toFixed(2);
            var per_60to69 = (info.FullyPer_Age60to69 * 100).toFixed(2);
            var per_70to79 = (info.FullyPer_Age70to79 * 100).toFixed(2);
            var per_80 = (info.FullyPer_80_ * 100).toFixed(2);
                    
            var selectedWeek = "<table class='table table-striped my-5'><tr><th>Total Vaccinations in 2021 <br> (up to selected week)</th><th>Total Vaccinations <br>(for selected week)</th><th>Moderna</th><th>Pfizer</th><th>Janssen</th><th>AstraZeneca</th></tr><tr><td>" + total_2021 + "</td><td>" + total_weekly + "</td><td>" + moderna + "</td><td>" + pfizer + "</td><td>" + janssen + "</td><td>" + astrazeneca + "</td></tr></table>";
                    
                    
            var ageForWeek = {"10 to 19": [cum_10to19, per_10to19] , "20 to 29": [cum_20to29, per_20to29] ,"30 to 39": [cum_30to39, per_30to39] , "40 to 49": [cum_40to49, per_40to49] , "50 to 59": [cum_50to59, per_50to59] , "60 to 69": [cum_60to69, per_60to69] , "70 to 79": [cum_70to79, per_70to79] , "80 plus": [cum_80, per_80] }; 
                    
        }
                  
    }
            
    return [selectedWeek, ageForWeek];
}
        
function weekDrop(obj){
    var vaccines = obj.features;
    var week_down;
    var week_count = 0;
            
    for (var i=1; i <vaccines.length; i++){
        var info = vaccines[i].attributes;
        var week_name = info.Week;
        week_count += 1;
                
        if (week_count == vaccines.length -1){
            week_down += "<option value='" + week_name +"' selected>Week " + week_count + "</option>";
        } else {
            week_down += "<option value='" + week_name +"'>Week " + week_count + "</option>";
        }
                
        document.getElementById("weekNumber").innerHTML = week_down;
    }
}
        
        
function caseInfo(obj, county1, county2, county3){
    cases = obj.features;
            
    casetext = "<table class='table table-striped my-5'>";
    casetext += "<tr><th>County</th><th>Population</th><th>Confirmed COVID Cases</th><th>Cases Per 100,000 People <br> (Population Proportional Cases)</th></tr>";
            
    var countyAr = [];
            
    for (var i=0; i < cases.length; i++){
        var caseinfo = cases[i].attributes;
        var county_name = caseinfo.CountyName;
                
        if (county_name == county1 || county_name == county2 || county_name == county3){
            if (! countyAr.includes(county_name)) {
                countyAr += county_name;
                var population = caseinfo.PopulationCensus16;
                var case_number = caseinfo.ConfirmedCovidCases;
                var proportion_cases = caseinfo.PopulationProportionCovidCases;
                        
                casetext += "<tr><td>" + county_name + "</td><td>" + population + "</td><td>" + case_number + "</td><td>" + Math.round(proportion_cases) + "</td></tr>";
            }
                        
        }
    }
            
    casetext += "</table>";
            
    return casetext;
}
                
        
function countyDropMinMax(obj){
    cases = obj.features;
    var counties = [];
    var counties_down = "<option value='' selected>Select County</option>";
            
    var max_cases = 0;
    var min_cases = 100001;
            
    for (var i=0; i < cases.length; i++){
        var caseinfo = cases[i].attributes;
        var county_name = caseinfo.CountyName;
        var proportion_cases = caseinfo.PopulationProportionCovidCases;
                
        if (! counties.includes(county_name)){
            counties += county_name;
            counties_down += "<option value='" + county_name +"'>" + county_name + "</option>";           
        }

        if (proportion_cases > max_cases){
            max_cases = proportion_cases;
            var max_county = county_name;
        }
                
        if (proportion_cases < min_cases){
            min_cases = proportion_cases;
            var min_county = county_name;
        }
    }
            
    document.getElementById("maxC").innerHTML = max_county;
    document.getElementById("maxN").innerHTML = Math.round(max_cases);
    document.getElementById("minC").innerHTML = min_county;
    document.getElementById("minN").innerHTML = Math.round(min_cases);
            
    document.getElementById("drop1").innerHTML = counties_down;
    document.getElementById("drop2").innerHTML = counties_down;
    document.getElementById("drop3").innerHTML = counties_down;
}
            

        
function updateWeekVaccines(){
    var selectedWeek = document.getElementById("weekNumber").value;
            
    var weekInfo = vaccineInfo(parsedVaccines, selectedWeek);
    var allWeek = weekInfo[0];
    var ageWeek = weekInfo[1];
    var groupList = "<ul class='list-group list-group-flush'>";
    var resultList = "<ul class='list-group list-group-flush'>";
            
    var ageGroups = Object.keys(ageWeek);
            
    for (var i=0; i < ageGroups.length; i++){
        groupList += "<li class='list-group-item'>" + ageGroups[i] + "</li>";
                
        if (document.getElementById("tot").checked == true){
            resultList += "<li class='list-group-item'>" + ageWeek[ageGroups[i]][0] + "</li>";
        } else {
            resultList += "<li class='list-group-item'>" + ageWeek[ageGroups[i]][1] + "%</li>";
        }
    }
            
            
    document.getElementById("info1").innerHTML = allWeek;
    document.getElementById("info2a").innerHTML = groupList;
    document.getElementById("info2b").innerHTML = resultList;
}
        
function currentWeek(obj){ 
    var vaccines = obj.features;
    var i = vaccines.length -1;
    var info = vaccines[i].attributes;
    var cWeek = info.Week;
    var cWeekInfo = vaccineInfo(obj, cWeek);
            
    var cAllWeek = cWeekInfo[0];
    var cAgeWeek = cWeekInfo[1];
            
    var groupList = "<ul class='list-group list-group-flush'>";
    var resultList = "<ul class='list-group list-group-flush'>";
            
    var ageGroups = Object.keys(cAgeWeek);
            
    for (var i=0; i < ageGroups.length; i++){
        groupList += "<li class='list-group-item'>" + ageGroups[i] + "</li>";
                
        if (document.getElementById("tot").checked == true){
            resultList += "<li class='list-group-item'>" + cAgeWeek[ageGroups[i]][0] + "</li>";
        } else {
            resultList += "<li class='list-group-item'>" + cAgeWeek[ageGroups[i]][1] + "%</li>";
        }
    }
            
    document.getElementById("info1").innerHTML = cAllWeek;
    document.getElementById("info2a").innerHTML = groupList;
    document.getElementById("info2b").innerHTML = resultList;
}
            
        
function updateCases(){
    var county1 = document.getElementById("drop1").value;
    var county2 = document.getElementById("drop2").value;
    var county3 = document.getElementById("drop3").value;
            
    var cInfo = caseInfo(parsedCases, county1, county2, county3);
            
    document.getElementById("info3").innerHTML = cInfo;
}
        