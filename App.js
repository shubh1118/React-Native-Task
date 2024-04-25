import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const fetchData = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

const heavyComputation = (item) => `${item.id}: ${item.title}`;

const ListItem = React.memo(({ item, onPress }) => {
  const details = useMemo(() => heavyComputation(item), [item]);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.listItem}>
        <Text>{details}</Text>
      </View>
    </TouchableOpacity>
  );
});

const DetailScreen = React.memo(({ postId }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post details:", error.message);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (!post) {
    return (
      <ActivityIndicator
        style={styles.loadingIndicator}
        size="large"
        color="#0000ff"
      />
    );
  }

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailText}>
        {post.id}: {post.title}
      </Text>
    </View>
  );
});

const App = () => {
  const [data, setData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };

    fetchDataAndSetData();
  }, []);

  const handleItemClick = useCallback((itemId) => {
    setSelectedItemId(itemId);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <ListItem item={item} onPress={() => handleItemClick(item.id)} />
    ),
    [handleItemClick]
  );

  return (
    <View style={styles.container}>
      {selectedItemId ? (
        <DetailScreen postId={selectedItemId} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: "#E1E3E6",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  detailContainer: {
    padding: 10,
  },
  detailText: {
    fontSize: 16,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
