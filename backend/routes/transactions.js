const router = require("express").Router();
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");

//CONSIDER MOVING EVERYTHING TO USER ROUTE?

//Helper
function dateCompare(a, b) {
  if (a.date > b.date) {
    return -1;
  } else if (a.date < b.date) {
    return 1;
  } else {
    return 0;
  }
}

router.route("/").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    console.log(req.body.username);
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      const type = req.body.filter.type;
      let filteredTrans = [];
      user.transactions.map((trans) => {
        if (trans[type] == req.body.filter.name) {
          filteredTrans.push(trans);
        }
      });
      res.json(filteredTrans.sort(dateCompare));
    }
  });
});

//Need to send user along with transaction to add to specific user. Can send it as a field inside the transaction object, take the ID?
router.route("/add").post((req, res) => {
  const description = req.body.description;
  const username = req.body.username;
  const amount = Number(req.body.amount);
  const date = new Date(req.body.date);
  const category = req.body.category;
  const paymentType = req.body.paymentType;
  const newTransaction = {
    //Create a normal object with removed ID
    description: description,
    amount: amount,
    date: date,
    subCategory: category,
    subPayment: paymentType,
  };
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      user.transactions.push(newTransaction);
      if (category === "Add to budget") {
          console.log(newTransaction);
        if (user.budget.length === 0) {
          const newBudget = {
            date: date,
            amount: amount * -1,
          };
          user.budget.push(newBudget);
        } else {
          let budgetIndex = user.budget.findIndex((item) => {
            if (
              (item.date.getMonth() == date.getMonth()) &&
              (item.date.getFullYear() == date.getFullYear())
            ) {
              return true;
            }
          });
          if (budgetIndex != -1) {
              console.log("added to current")
            user.budget[budgetIndex].amount += amount * -1;
          } else {
            const newBudget = {
              date: date,
              amount: amount * -1,
            };
            console.log("made new");
            user.budget.push(newBudget);
          }
        }
      } else {
        user.categories.forEach((cat, index) => {
          let subCatIndex = cat.subCategories.findIndex(
            (subCat) => subCat.name === category
          );
          if (subCatIndex != -1) {
            let dateIndex = cat.subCategories[subCatIndex].actual.findIndex(
              (item) => {
                if (
                  item.date.getMonth() == date.getMonth() &&
                  item.date.getFullYear() == date.getFullYear()
                ) {
                  return true;
                }
              }
            );
            if (dateIndex != -1) {
              user.categories[index].subCategories[subCatIndex].actual[
                dateIndex
              ].amount += amount; //adds amount to actual
            } else {
              newDateObj = {
                date: date,
                amount: amount,
              };
              user.categories[index].subCategories[subCatIndex].actual.push(
                newDateObj
              );
            }
          }
        });
      }
      user.markModified("budget")
      user.markModified("categories");
      user
        .save()
        .then(() => res.json("Success"))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      res.status(400).json("Error: no result found");
    }
  });
});

router.route("/delete").post((req,res)=>{
    const username = req.body.rows[0].username;
    const toBeDeleted = req.body.rows;
    console.log(toBeDeleted);
    User.findOne({ username: username }, (err, user) => {
        if (err) {
          res.status(400).json("Error: no result found");
        } else if (user) {
            toBeDeleted.forEach((transaction)=>{
                let transIndex = user.transactions.findIndex((item)=>{
                    console.log(item);
                    if((item.description == transaction.description) && (item.amount == transaction.amount.substring(1)* -1) && (new Date(item.date).getFullYear() == new Date(transaction.date).getFullYear()) && (new Date(item.date).getMonth() == new Date(transaction.date).getMonth()) && (new Date(item.date).getDate() == new Date(transaction.date).getDate()) && (item.subCategory == transaction.category) && (item.subPayment == transaction.account)){
                        return true;
                    }
                })
                console.log("Transaction index is " + transIndex)
                if(transIndex != -1){
                    user.transactions.splice(transIndex,1);
                    if(transaction.category == "Add to budget"){
                        let budgetIndex = user.budget.findIndex((item)=> {
                          console.log(item);
                            if((new Date(item.date).getFullYear() == new Date(transaction.date).getFullYear()) && (new Date(item.date).getMonth() == new Date(transaction.date).getMonth())){
                                return true;
                            }
                        })
                        console.log("budget index is " +budgetIndex);
                        user.budget[budgetIndex].amount -= transaction.amount.substring(1);
                        user.markModified("budget");
                    }else{
                        console.log("removing a transaction")
                        let subCatIndex;
                        user.categories.forEach((item)=> {
                            subCatIndex = item.subCategories.findIndex((subcat)=>{
                                console.log(transaction);
                                console.log(subcat);
                                if(subcat.name == transaction.category){
                                    return true;
                                }
                            });
                            console.log("subcatindex is " + subCatIndex)
                            if(subCatIndex != -1){
                                let dateIndex = item.subCategories[subCatIndex].actual.findIndex((item)=>{
                                    if(new Date(item.date).getFullYear() == new Date(transaction.date).getFullYear() && new Date(item.date).getMonth() == new Date(transaction.date).getMonth() && new Date(item.date).getDate() == new Date(transaction.date).getDate()){
                                        return true;
                                    }
                                })
                                console.log("dateindex is " + dateIndex)
                                if(dateIndex != -1){
                                    item.subCategories[subCatIndex].actual[dateIndex].amount -= (transaction.amount.substring(1)* -1);
                                }
                            }
                        })
                        user.markModified("categories");
                    }
                }
            })
            user.save()
                .then(()=> res.json("success"))
                .catch((err)=> res.status(400).json("Error: " + err));
        }else{
            res.status(400).json("Error: no result found");
        }
})
});

module.exports = router;
