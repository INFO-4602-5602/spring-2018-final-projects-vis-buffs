# extract features related to user's Yelp rating

import pandas as pd
import numpy as np


if __name__ == "__main__":

    cat_data = pd.read_csv("../data/review_cat_user_userFeature_100user.csv")
    loc_data = pd.read_csv("../data/buiness_loc_star50000.csv")
    # print(review_data)

    # restaurant category & rating
    restaurant_category_vs_rating = cat_data.groupby(["category", "review_stars"]).size()
    restaurant_category_vs_rating = restaurant_category_vs_rating.groupby(level=0).apply(lambda x: 100*x/float(x.sum()))
    restaurant_category_vs_rating = restaurant_category_vs_rating.unstack(level=1, fill_value=0)
    #restaurant_category_vs_rating.to_csv("../data/restaurant_category_rating.csv")

    # restaurant loc & rating
    loc_vs_rating = loc_data.groupby("state")['stars'].mean()
    print(loc_vs_rating)
