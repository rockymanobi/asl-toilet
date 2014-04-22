
function Foo()
{
    this.x = 1;
}

Foo.prototype.A = function()
{
    // メソッド内からのプロパティへのアクセス
    this.x++;
}


var foo = new Foo();

// インスタンスからのプロパティへのアクセス
foo.x++;
