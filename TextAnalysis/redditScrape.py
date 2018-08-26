#! usr/bin/env python3
import praw
import pandas as pd
import csv
import regex as re
import unicode
topics_dict= {"title":[],
			  "body":[],
			  "id":[]}

comments_dict = {"comment":[]}

final_dict = {"text":[],
			  "y":[]}

reddit = praw.Reddit(client_id='PhsKwZb7-RhdzA',
					 client_secret='K7DqHgmHJFQRFIxZmWoVtfkejVE',
					 user_agent='hackthe6ix',
					 username='kliyle',
					 password='erlison25')

subreddit = reddit.subreddit('Depression')

top_subreddit = subreddit.top(limit=1000)

for post in top_subreddit:
	topics_dict['id'].append(post.id)
	topics_dict['body'].append(post.selftext)
	topics_dict['title'].append(post.title)
	final_dict['text'].append(post.selftext.replace(",", " "))
	final_dict['y'].append('0')
	final_dict['text'].append(post.title.replace(",", " "))
	final_dict['y'].append('0')

all_data = pd.DataFrame(final_dict)
all_data.to_csv('depressionSubreddit.csv',index=False, header=False)

with open("depressionSubreddit.csv",'a') as csvfile:
	csvwriter = csv.writer(csvfile, delimiter = ',')
	for post_id in topics_dict['id']:
		submission = reddit.submission(post_id)

		submission.comments.replace_more(limit=None)
		for comment in submission.comments.list():
			body = str(comment.body)
			body = re.sub('[^ A-Za-z0-9\.]+', '', body)
			#body = body.replace('\\u2018',"")
			#body = body.replace('\\u2019',"").replace(","," ")
			#body = body.decode('utf-8')
			print(body)
			if body.find("deleted")<0 and body.find("removed")<0: 
				comments_dict['comment'].append(body)
				csvwriter.writerow([body,'0'])
			#final_dict['y'].append('0')


# with open("depressionSubreddit.csv",'a') as csvfile:
# 	for comment in comments_dict['comment']:
# 		csvfile.writerow([comment, '0'])