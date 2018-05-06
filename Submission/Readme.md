# Instructions of our visualization project

- [Preview](http://creative.colorado.edu/~wemi4704/projects/vis/final/Submission/)
- writeup.pdf

## Our report

- in /Submission, run "python -m SimpleHTTPServer 8000"

## Our visualizations include the following parts:

1) Our story
2) Our goal
3) Our design (vis drafts)
4) Visualizations (visualizing features related to rating prediction)

 - vis_1: Restaurant category & Yelp rating (mouse over to see average rating for each category).
 - vis_2: US Yelp rating map (mouse over to see average rating in each state).
 - vis_3: Word cloud from Yelp reviews (different color represent different ratings, different size represent the different frequency of a word, the larger the more frequent).
 - vis_4: Yelp user friendship network (drag any node to move the network, mouse over each node to see average rating of the user), this network consists of a start user and his 39 friends, the line width indicates the count of business that the two users both rated on Yelp.

5) Split (visualizing how to find the best split of a feature)

 - drag the black threshold bar to change to cut-off and visualize changes in prediction result
 - ref: https://research.google.com/bigpicture/attacking-discrimination-in-ml/
 
6) Feature Ranking
- mouseover to see the score of each feature, the score indicates the importance of each feature in rating prediction.

7) Tree Model
- click the "Accuracy" button to start the decision tree demo, we use 100 users data to test the prediction accuracy.
