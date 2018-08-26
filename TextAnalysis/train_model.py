import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt
import sklearn
import pandas as pd
from sklearn.model_selection import train_test_split
from load_data import load_data
	
(train_data, y_train), (x_test, y_test) = load_data()
model = keras.Sequential()
model.add(keras.layers.Embedding(10000, 64, input_length=256))
#model.add(keras.layers.Conv1D(32,2, activation='relu'))
#model.add(keras.layers.MaxPooling1D(pool_size=4))
#model.add(keras.layers.Dropout(0.4))
model.add(keras.layers.GlobalAveragePooling1D())
#model.add(keras.layers.Flatten())
model.add(keras.layers.Dense(256, activation='relu'))
model.add(keras.layers.Dropout(0.4))
model.add(keras.layers.Dense(128, activation='relu'))
model.add(keras.layers.Dropout(0.4))
model.add(keras.layers.Dense(1, activation='sigmoid'))

model.summary()

model.compile(optimizer=keras.optimizers.Adam(), loss='binary_crossentropy', metrics=['accuracy'])

history = model.fit(train_data, y_train, epochs=3, batch_size=512, validation_data=(x_test, y_test))

model.save('embedding_trained_model.h5')

test_loss, test_acc = model.evaluate(x_test,y_test)

print('Test accuracy:', test_acc)

plt.figure(figsize=[8,6])
plt.plot(history.history['loss'],'r',linewidth=3.0)
plt.plot(history.history['val_loss'],'b',linewidth=3.0)
plt.legend(['Training loss', 'Validation Loss'],fontsize=18)
plt.xlabel('Epochs ',fontsize=16)
plt.ylabel('Loss',fontsize=16)
plt.title('Loss Curves',fontsize=16)

plt.show()

# Accuracy Curves
plt.figure(figsize=[8,6])
plt.plot(history.history['acc'],'r',linewidth=3.0)
plt.plot(history.history['val_acc'],'b',linewidth=3.0)
plt.legend(['Training Accuracy', 'Validation Accuracy'],fontsize=18)
plt.xlabel('Epochs ',fontsize=16)
plt.ylabel('Accuracy',fontsize=16)
plt.title('Accuracy Curves',fontsize=16)
plt.show()