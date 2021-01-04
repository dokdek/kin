const router = require('express').Router();
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');

//CONSIDER MOVING EVERYTHING TO USER ROUTE?

//Helper
function dateCompare(a,b){
    if (a.date > b.date){
        return -1;
    }else if(a.date < b.date){
        return 1;
    }else{
        return 0;
    }
}

router.route('/').post((req, res) => {
    User.findOne({username: req.body.username},(err, user) => {
        console.log(req.body.username);
        if(err){
            res.status(400).json("Error: no result found");
        }else if(user){
            const type = req.body.filter.type;
            let filteredTrans = [];
            user.transactions.map((trans) => {
                if(trans[type] == req.body.filter.name){
                    filteredTrans.push(trans);
                }
            });
            res.json(filteredTrans.sort(dateCompare)); 
        }
    });
});


//Need to send user along with transaction to add to specific user. Can send it as a field inside the transaction object, take the ID?
router.route('/add').post((req, res) => {
    const description = req.body.description;
    const username = req.body.username;
    const amount = Number(req.body.amount);
    const date = new Date(req.body.date);
    const category = req.body.category;
    const paymentType = req.body.paymentType;
    const newTransaction = { //Create a normal object with removed ID
        description: description,
        amount: amount,
        date: date,
        subCategory: category,
        subPayment: paymentType
    };
    User.findOne({username: username},(err, user) => {
        if(err){
            res.status(400).json("Error: no result found");
        }else if(user) {
            user.transactions.push(newTransaction);
            user.categories.forEach((cat, index)=>{
                let subCatIndex = cat.subCategories.findIndex((subCat) => subCat.name === category);
                if(subCatIndex != -1){
                    let dateIndex = cat.subCategories[subCatIndex].actual.findIndex((item)=> {
                        if((item.date.getMonth() == date.getMonth()) && (item.date.getFullYear() == date.getFullYear())){
                            return true;
                        }
                    })
                    if(dateIndex != -1){
                        user.categories[index].subCategories[subCatIndex].actual[dateIndex].amount += amount; //adds amount to actual
                    }else{
                        newDateObj = {
                            date: date,
                            amount: amount
                        }
                        user.categories[index].subCategories[subCatIndex].actual.push(newDateObj)
                    }
                }
            })
            user.markModified("categories");
            user.save()
                .then(()=>res.json("Success"))
                .catch(err => res.status(400).json("Error: " + err));
        }else {
            res.status(400).json("Error: no result found");
        }
    });
})

router.route('/:id').get((req,res) => {
    Transaction.findById(req.params.id)
        .then(transaction => res.json(transaction))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/:id').delete((req, res) => {
    Transaction.findByIdAndDelete(req.params.id)
        .then(() => res.json('Deleted'))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/update/:id').post((req, res) => {
    Transaction.findById(req.params.id)
        .then(transaction => {
            transaction.username = req.body.username;
            transaction.description = req.body.description;
            transaction.amount = Number(req.body.amount);
            transaction.date = Date.parse(req.body.date);
            transaction.category = req.body.category;
            transaction.paymentType = req.body.paymentType;
            transaction.save()
                .then(() => res.json('Updated successfully'))
                .catch(err => res.status(400).json('Error: '+ err));
        })
})

module.exports = router;