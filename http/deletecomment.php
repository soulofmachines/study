<?php require_once("function.php");?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Удалить комментарий</title>
</head>
<body>
<?php
$id = fill_get('id');
$art_id = fill_get('art_id');

if (isset($id)) {
	require_once("db.php");
	if ($_SERVER['REQUEST_METHOD'] == "POST") {
		$confirm = fill_post('confirm');
		if (isset($confirm)) {
			mysqli_query($db, "DELETE FROM comments WHERE id = $id");
		}
	}

	$query = "SELECT id FROM comments WHERE id = $id";
	$result = mysqli_query($db, $query);
	if (mysqli_num_rows($result) > 0) {
?>
<form action="<?php echo $_SERVER['REQUEST_URI'];?>" enctype="multipart/form-data" method="POST">
<input type="checkbox" name="confirm">
<input type="submit"><br/>
</form>
<?php
	} else {
		echo "Комментарий удален или не создан<br>";
	}
}
?>
<a href="comments.php?id=<?php echo $art_id;?>">К комментариям</a><br/>
<a href="/index.php">Главная страница</a>
</body>
</html>
