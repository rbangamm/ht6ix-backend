import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt
import sklearn
import pandas as pd
import json
from sklearn.model_selection import train_test_split

dictionary = {}

def convert_text_to_index_array(text):
	arr = [dictionary.get(word) for word in keras.preprocessing.text.text_to_word_sequence(text)]
	return [x if x is not None else 0 for x in arr]

def load_data():
	data = pd.read_csv('decodedTweets.csv', sep=',', dtype={"Text":object, "Value":np.int32})
	#print(depression_data)
	data = data.values

	train_x = [str(x[0]) for x in data]
	train_y	= [x[1] for x in data]

	tokenizer = keras.preprocessing.text.Tokenizer(num_words=10000, oov_token=0)
	tokenizer.fit_on_texts(train_x)
	dictionary = tokenizer.word_index

	with open('dictionary.json', 'w') as dictionary_file:
    		json.dump(dictionary, dictionary_file)

	allWordIndices = []
	for i in train_x:
		text = str(i)
		wordIndices = convert_text_to_index_array(text)
		allWordIndices.append(wordIndices)

	allWordIndices = np.asarray(allWordIndices)
	allWordIndices = keras.preprocessing.sequence.pad_sequences(allWordIndices, value=0, padding='post', maxlen=256)

	x_train, x_test, labels_train, labels_test = sklearn.model_selection.train_test_split(allWordIndices, train_y, test_size=0.2, random_state=42)

	return (x_train, labels_train), (x_test, labels_test)