# extract features related to user's Yelp rating

import pandas as pd
import numpy as np


if __name__ == "__main__":

    cat_data = pd.read_csv("../data/review_cat_user_userFeature_100user.csv")
    loc_data = pd.read_csv("../data/business_loc_star_US.csv")
    cat_data_sel = pd.read_csv("../data/restaurant_category_rating_select.csv")
    # print(review_data)

    # restaurant category & rating
    restaurant_category_vs_rating = cat_data.groupby(["category", "review_stars"]).size()
    restaurant_category_vs_rating = restaurant_category_vs_rating.groupby(level=0).apply(lambda x: 100*x/float(x.sum()))
    restaurant_category_vs_rating = restaurant_category_vs_rating.unstack(level=1, fill_value=0)
    #restaurant_category_vs_rating.to_csv("../data/restaurant_category_rating.csv")

    cat_data_sel['avg'] =  cat_data_sel["1"]*0.01 + cat_data_sel["2"]*0.02 + cat_data_sel["3"]*0.03 + cat_data_sel["4"]*0.04 + cat_data_sel["5"]*0.05
    cat_data_sel = cat_data_sel[['category', 'avg']]
    # cat_data_sel.to_csv("../data/restaurant_category_rating_sel_avg.csv")

    # restaurant loc & rating
    loc_vs_rating = loc_data.groupby("state")['stars'].mean()
    print(loc_vs_rating)
