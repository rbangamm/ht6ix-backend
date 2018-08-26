import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt
import sklearn
import pandas as pd
from sklearn.model_selection import train_test_split
depression_data = pd.read_csv('depressionSubreddit.csv', sep=',', header=None, encoding='utf-8')
depression_data.dropna()
#print(depression_data)
print(depression_data.shape)
tweet_data = pd.read_csv('decodedTweets.csv', sep=',',header=None)
data = depression_data.append(tweet_data)

x = data[:][0]
y = data[:][1]

tokenizer = keras.preprocessing.text.Tokenizer(num_words=10000)
tokenizer.fit_on_texts(x)
dictionary = tokenizer.word_index
print('Done fit!')
allWordIndices = []
#test_allWordIndices = []
for text in x:
	wordIndices = convert_text_to_index_array(text)
	allWordIndices.append(wordIndices)
print(allWordIndices[0])
# for text in x:
# 	wordIndices = convert_text_to_index_array(text)
# 	test_allWordIndices.append(wordIndices)

allWordIndices = np.asarray(allWordIndices)
#test_allWordIndices = np.asarray(test_allWordIndices)

x_train, x_test, labels_train, labels_test = sklearn.model_selection.train_test_split(allWordIndices, y, test_size = 0.2, random_state=42)

x_train = keras.preprocessing.sequence.pad_sequences(allWordIndices, value=0, padding='post', maxlen=256)
x_test = keras.preprocessing.sequence.pad_sequences(test_allWordIndices, value=0, padding='post', maxlen=256)
np.save("processedData.npy",np.array(x_train, labels_train), (x_test, labels_test),)

def convert_text_to_index_array(text):
	return [dictionary[word] for word in keras.preprocessing.text.text_to_word_sequence(text)]