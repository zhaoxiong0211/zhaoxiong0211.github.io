var property_by_type = {name:"Property", children:[], childrens:[], basis:0},
    property_by_state = {name:"Property", children:[], childrens:[], basis:0};

propertyData.forEach(function(d){
    var temBasis = parseFloat(d.Basis.slice(1).split(",").join(""));
    property_by_type.basis += temBasis;
    if (property_by_type.childrens.indexOf(d.Portfolio) != -1){
        var portfolioIndex = property_by_type.childrens.indexOf(d.Portfolio);
        var portfolioLevel = property_by_type.children[portfolioIndex];
        portfolioLevel.basis += temBasis;
        if (portfolioLevel.childrens.indexOf(d["Property Type"]) != -1){
            var typeIndex = portfolioLevel.childrens.indexOf(d["Property Type"]);
            var typeLevel = portfolioLevel.children[typeIndex];
            typeLevel.basis += temBasis;
            typeLevel.children.push({name:d["Property Name"], basis: temBasis, info:d});
        }
        else {
            portfolioLevel.children.push({name:d["Property Type"], children:[{name:d["Property Name"], basis: temBasis, info:d}], basis: temBasis});
            portfolioLevel.childrens.push(d["Property Type"]);
        }
    }
    else {
        property_by_type.childrens.push(d.Portfolio);
        property_by_type.children.push({name:d.Portfolio, children:[{name:d["Property Type"], children:[{name:d["Property Name"], basis:temBasis, info:d}], basis:temBasis}], childrens:[d["Property Type"]], basis:temBasis});
    }
})

propertyData.forEach(function(d){
    var temBasis = parseFloat(d.Basis.slice(1).split(",").join(""));
    property_by_state.basis += temBasis;
    if (property_by_state.childrens.indexOf(d.Portfolio) != -1){
        var portfolioIndex = property_by_state.childrens.indexOf(d.Portfolio);
        var portfolioLevel = property_by_state.children[portfolioIndex];
        portfolioLevel.basis += temBasis;
        if (portfolioLevel.childrens.indexOf(d["Postal State"]) != -1){
            var stateIndex = portfolioLevel.childrens.indexOf(d["Postal State"]);
            var stateLevel = portfolioLevel.children[stateIndex];
            stateLevel.basis += temBasis;
            stateLevel.children.push({name:d["Property Name"], basis: temBasis, info:d});
        }
        else {
            portfolioLevel.children.push({name:d["Postal State"], children:[{name:d["Property Name"], basis: temBasis, info:d}], basis: temBasis});
            portfolioLevel.childrens.push(d["Postal State"]);
        }
    }
    else {
        property_by_state.childrens.push(d.Portfolio);
        property_by_state.children.push({name:d.Portfolio, children:[{name:d["Postal State"], children:[{name:d["Property Name"], basis:temBasis, info:d}], basis:temBasis}], childrens:[d["Postal State"]], basis:temBasis});
    }
})