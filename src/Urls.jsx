import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Outlet from "./pages/Outlet";
import Category from "./pages/Category";
import Brand from "./pages/Brand";
import Unit from "./pages/Unit";
import Product from "./pages/Product";
import Supplier from "./pages/Supplier";
import Purchase from "./pages/Purchase";
import PurchaseItems from "./pages/PurchaseItems";
import PurchasePayment from "./pages/PurchasePayment";
import PurchaseCost from "./pages/PurchaseCost";
import Cost from "./pages/Cost";
import Customer from "./pages/Customer";
import Sale from "./pages/Sale";
import SaleItems from "./pages/SaleItems";
import SalePayment from "./pages/SalePayment";
import Stock from "./pages/Stock";
import Login from "./pages/Login";
import Manager from "./pages/Manager";
import Stuff from "./pages/Stuff";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const Urls = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/outlet" component={Outlet} />
        <Route exact path="/manager" component={Manager} />
        <Route exact path="/stuff" component={Stuff} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/category" component={Category} />
        <Route exact path="/brand" component={Brand} />
        <Route exact path="/unit" component={Unit} />
        <Route exact path="/product" component={Product} />
        <Route exact path="/supplier" component={Supplier} />
        <Route exact path="/purchase" component={Purchase} />
        <Route exact path="/purchaseItems" component={PurchaseItems} />
        <Route exact path="/purchasePayment" component={PurchasePayment} />
        {/* <Route exact path="/purchaseCost" component={PurchaseCost} />
        <Route exact path="/cost" component={Cost} /> */}
        <Route exact path="/customer" component={Customer} />
        <Route exact path="/sale" component={Sale} />
        <Route exact path="/saleItems" component={SaleItems} />
        <Route exact path="/salePayment" component={SalePayment} />
        <Route exact path="/stock" component={Stock} />
        <Route exact path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Urls;
