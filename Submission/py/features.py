# extract features related to user's Yelp rating

import pandas as pd
import numpy as np
from sklearn.metrics import confusion_matrix

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
    # print(loc_vs_rating)

    # best split
    # binary: < 4 Bad, >=4 Good
    cat_data_split = cat_data[['review_stars', 'user_average_stars']]
    cat_data_split['review_stars_bin'] = np.where(cat_data_split['review_stars'] > 3, 1, 0)

    for threshold in np.arange(0.0, 5.1, 0.1):

        cat_data_split['user_average_stars_bin'] = np.where(cat_data_split['user_average_stars'] > threshold, 1, 0)
        tn, fp, fn, tp = confusion_matrix(cat_data_split['review_stars_bin'].tolist(), cat_data_split['user_average_stars_bin'].tolist()).ravel()
        total = tn + fp + fn + tp
        correct = float(tn + tp)/total*100
        incorrect = float(fp + fn)/total*100
        print(correct, incorrect)

    # cat_data_split.to_csv("../data/rating_user_avg_star.csv")
