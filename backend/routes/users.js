const router = require("express").Router();
let User = require("../models/user.model");
require("dotenv").config();


router.route("/logout").get((req,res)=>{
  res.clearCookie('token');
  res.status(200).json("Logged out")
})

router.route("/getCategory").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      res.json(user.categories);
    } else {
      res.status(400).json("Error: no result found");
    }
  });
});

router.route("/getPayment").post((req, res) => {
  console.log(req.body.username);
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      res.json(user.paymentType);
    } else {
      res.status(400).json("Error: no result found");
    }
  });
});

router.route("/addCategory").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      const category = {
        category: req.body.category,
        subCategories: [],
      };
      user.categories.push(category);
      user
        .save()
        .then(() => res.json("Success"))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      res.status(400).json("Error: no result found");
    }
  });
});

router.route("/addSubCategory").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      console.log(user.categories[0]);
      const newSubCat = {
        name: req.body.subCategory,
        budgeted: [
          {
            date: new Date(),
            amount: 0,
          },
        ],
        actual: [],
        available: [{
          date: new Date(),
          amount: 0
        }]
      };
      user.categories[
        user.categories.findIndex(
          (category) => category.category === req.body.category
        )
      ].subCategories.push(newSubCat); //Finds index of main cat, then push subcat to maincat
      user.markModified("categories"); //Due to nested object, need to specify what property was changed for mongoose to save.
      user
        .save()
        .then(() => res.json("Success"))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      res.status(400).json("Error: no result found");
    }
  });
});

router.route("/addPayment").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      const payment = {
        payment: req.body.category,
        subPayments: [],
      };
      user.paymentType.push(payment);
      user
        .save()
        .then(() => res.json("Success"))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      res.status(400).json("Error: no result found");
    }
  });
});

router.route("/addSubPayment").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      user.paymentType[
        user.paymentType.findIndex(
          (payment) => payment.payment === req.body.category
        )
      ].subPayments.push(req.body.subCategory); //Finds index of main cat, then push subcat to maincat
      user.markModified("paymentType");
      user
        .save()
        .then(() => res.json("Success"))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      res.status(400).json("Error: no result found");
    }
  });
});

router.route("/updateBudgeted").post((req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.status(400).json("Error: no result found");
    } else if (user) {
      const catIndex = user.categories.findIndex(
        (category) => category.category === req.body.category
      );
      const subCatIndex = user.categories[catIndex].subCategories.findIndex(
        (subCat) => subCat.name === req.body.subCategory
      );
      const dateIndex = user.categories[catIndex].subCategories[
        subCatIndex
      ].budgeted.findIndex((budgeted) => {
          console.log(budgeted.date.getMonth());
          console.log(req.body);
        budgeted.date.getMonth() == new Date(req.body.date).getMonth() &&
          budgeted.date.getFullYear() == new Date(req.body.date).getFullYear();
      });
      if (dateIndex == -1) {
        const newBudgeted = {
          date: new Date(),
          amount: req.body.amount,
        };
        user.categories[catIndex].subCategories[subCatIndex].budgeted.push(
          newBudgeted
        );
      } else {
        user.categories[catIndex].subCategories[subCatIndex].budgeted[
          dateIndex
        ].amount = req.body.amount; //Need to implement month/year search
      }
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

/*router.route('/:id').get((req,res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/update/:id').post((req,res) => {
    User.findById(req.params.id)
        .then(user => {
            user.username = req.body.username
            user.save()
                .then(() => res.json('Updated successfully'))
                .catch(err => res.status(400).json('Error ' + err));
        });
});

router.route('/delete/:id').delete((req,res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User sucessfully deleted'))
        .catch(err => res.status(400).json('Error ' + err));
});*/

module.exports = router;
