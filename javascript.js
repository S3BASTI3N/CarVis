/**
 * Created by Sebastien on 09/09/2016.
 */

function loadVisualisation()
{
    readDataFile("cars.csv");
}

function readDataFile(fileName)
{
    var file = d3.csv(fileName, parseRow, onDataLoaded );
}

function parseRow(d)
{
    return {
        MPG: parseInt(d.MPG),
        cylinders: parseInt(d.cylinders),
        horsepower: parseInt(d.horsepower),
        model: d.model,
        origin: d.origin,
        weight: parseInt(d.weigth), // correct for spelling weight vs weigth
        year: parseInt(d.year)
    }
}

function onDataLoaded(data)
{
    console.log("loaded data");
    console.log(data)
}