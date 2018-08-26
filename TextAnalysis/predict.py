import tensorflow
from tensorflow import keras
import h5py
import sys
import json

with open("dictionary.json",'r') as dict_file:
	dictionary=json.load(dict_file)

def text_to_index_array(text):
	arr = [dictionary.get(word) for word in keras.preprocessing.text.text_to_word_sequence(text)]
	return [x if x is not None else 0 for x in arr]


def main(argv):
	index_array = text_to_index_array(sys.argv[1])
	model.load("trained_model.h5")
	prediction = model.predict(index_array)
	print(prediction)
	sys.stdout.flush()


if __name__ == '__main__':
	main()