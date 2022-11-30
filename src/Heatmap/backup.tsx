// const quantizeOpacity = (dimz) => {
//     let domain = [];
//     let fillOpacity;
//     allData.json.features.forEach((f) => {
//         domain.push(f.properties[dimz.value]);
//     });

// // extent: calculates min and max in an array
//     if (extent(domain)[0] === extent(domain)[1]) {
//         fillOpacity = "tmpoly-plus-100-black";
//     } else {
//         const opacity = scaleQuantize()
//             .domain(extent(domain))
//             .range([0.2, 0.35, 0.5, 0.65, 0.8]);

//         fillOpacity = [
//             'step',
//             ['get', dimz.value],
//             "tmpoly-plus-100-black",
//             opacity.invertExtent(0.2)[0],
//             "tmpoly-circle-light-100-black",
//             opacity.invertExtent(0.35)[0],
//             "tmpoly-grid-light-200-black",
//             opacity.invertExtent(0.5)[0],
//             "tmpoly-line-vertical-down-light-100-black",
//             opacity.invertExtent(0.65)[0],
//             "tmpoly-caret-200-black",
//             opacity.invertExtent(0.8)[0],
//             "tmpoly-caret-200-black",
//         ];
//     }
//     return fillOpacity;
// };