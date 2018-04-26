# extract features related to user's Yelp rating

import pandas as pd
import numpy as np


if __name__ == "__main__":

    data = pd.read_csv("../data/review_cat_user_userFeature_100user.csv")
    # print(review_data)

    # restaurant category & user rating
    restaurant_category_vs_rating = data.groupby(["category", "review_stars"]).size()
    restaurant_category_vs_rating = restaurant_category_vs_rating.groupby(level=0).apply(lambda x: 100*x/float(x.sum()))
    restaurant_category_vs_rating = restaurant_category_vs_rating.unstack(level=1, fill_value=0)
    restaurant_category_vs_rating.to_csv("../data/restaurant_category_rating.csv")

    # user average rating & user rating
    
