import csv
import pandas as pd
import regex as re

tweet_dict = {"text":[],
			  "y":[]}

with open('sentiment140.csv','r', encoding='latin-1') as csvfile:
	csvReader = csv.reader(csvfile)
	next(csvReader,None)
	for row in csvReader:
		if not '0' in row[0]:
			tweet = str(row[5])
			tweet = re.sub('[^ A-Za-z0-9\.]+', '', tweet)
			# print(row[5])
			# tweet = str(row[5])
			# print(tweet)
			# index = tweet.find('@')
			# while index > 0:
			# 	next_space = tweet.find(' ', index + 1)
			# 	if next_space < 0:
			# 		tweet = row[:index]
			# 	else :
			# 		tweet = row[:index] + row[next_space:]
			tweet_dict["text"].append(tweet)
			tweet_dict["y"].append('1')

tweet_data = pd.DataFrame(tweet_dict)
with open('decodedTweets.csv', 'a') as csvfile:
	tweet_data.to_csv(csvfile,index=False, header=False)


# fname='training_set_tweets.txt'
# with open(fname, encoding='utf-8') as fp:
# 	line = fp.readline()
# 	count+=1
# 	while line:
# 		if "depressed" in line:
# 			sum_word +=1
# 			print(line)
# 		sum_word +=1
# 		line = fp.readline()

# print(sum_word)
# print(count)