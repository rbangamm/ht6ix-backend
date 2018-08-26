import numpy as np
import pandas as pd
np.random.seed(10)
data = pd.read_csv('redditPosts.csv', sep=',', header=None, encoding='utf-8', dtype=object)
data.dropna()

#print(x.encode('utf-8'))
#for i in range(len(x)):
#	x[i] = str(x[i]).replace('\\u2019',"")

#data = data.sample(frac=0.4)
#data = x.merge(y)
data.to_csv('redditPosts.csv',sep=',',index=False,header=None)