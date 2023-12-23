

var attr = ["Product Id", "subcategory", "title", "price", "popularity", "Description", "Rating", "UTM Source", "UTM Medium"]
var display = []
var selected = []

const rerender = () =>{
    
    document.getElementById("tab1").innerHTML=""
    document.getElementById("tab2").innerHTML=""
    for(const i in attr)
    {
        document.getElementById("tab1").innerHTML += "<span style='cursor:pointer' onclick=\"selectattr(event,'" + attr[i] + "')\">" + attr[i] + "</span><br>";

    }
    for(const i in display)
    {
        document.getElementById("tab2").innerHTML += "<span style='cursor:pointer' onclick=\"selectattr(event,'" + display[i] + "')\">" + display[i] + "</span><br>";

    }
}
rerender()

const selectattr =(event, aid)=>{
    
    var spanElement = event.target;
    spanElement.style.backgroundColor = 'lightblue';

    console.log("old selected", selected)
    if(selected.includes(aid))
    {   selected=selected.filter(i=>(i!==aid))
        spanElement.style.backgroundColor = 'white';
        return;
    }
    selected=[...selected, aid];
    //console.log("new selected", selected, typeof(selected))
    
}



const shiftright = () =>{
    display=[...display, ...selected]
    selected.forEach((i)=>{
       console.log(i)
       attr=attr.filter((el)=>el!==i)
    })
    selected=[]
    rerender()
}
const shiftleft = () =>{
    attr=[...attr, ...selected]
    selected.forEach((i)=>{
       console.log(i)
       display=display.filter((el)=>el!==i)
    })
    selected=[]
    rerender()
}

function generateTable() {
    var thead = document.getElementById("tablehead")
    var tbody = document.getElementById("tablebody")
    thead.innerHTML=""
    tbody.innerHTML=""

    display.forEach(i=>{
        thead.innerHTML+="<th>"+i+"</th>"
    })



    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    
    if (file) {
        
        const fileType = document.getElementById("fileType").value;
        console.log(fileType)
        if (fileType === "json")
        { const blobUrl = URL.createObjectURL(file);
            console.log("in")
            fetch(blobUrl)
            .then(response => response.text())
            .then(fileContent => {
                // Parse the JSON content
                try {
                    const jsonData = JSON.parse(fileContent);
                    //console.log(jsonData)
                    const products = jsonData.products
                    outputTable(products)
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Error parsing JSON. Please check the console for details.');
                }
            })
        }
        else if(fileType === "csv") 
        {
            // CSV file handling
            const reader = new FileReader();

            reader.onload = function (e) {
                const csvContent = e.target.result;
                const products = parseCSV(csvContent);
                outputTable(products);
            };

            reader.readAsText(file, "UTF-8");
        }
    } 
    else {
    alert("Please select a file.");
    }
}//end of function



function parseCSV(csvContent) {
const lines = csvContent.split(/\r\n|\n/);
const headers = lines[0].split(",");
const products = [];

for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const product = {};

    for (let j = 0; j < headers.length; j++) {
        product[headers[j]] = values[j];
    }

    products.push(product);
}

return products;
}






















const outputTable = (products) =>{
    
    var tbody = document.getElementById("tablebody")
    
     // Convert products object into an array
    const productArray = Object.keys(products).map(key => ({
        "Product Id": key,
        ...products[key]
    }));

    // Sort products based on descending popularity
    productArray.sort((a, b) => b.popularity - a.popularity);
    console.log(productArray)


    productArray.forEach(product=>{
        
        const newRow = document.createElement("tr");

        display.forEach((attrb) => {
            
                const newCell = document.createElement("td");
                newCell.textContent = product[attrb];
                newRow.appendChild(newCell);
            
            
        });

        tbody.appendChild(newRow);
    })
          
}