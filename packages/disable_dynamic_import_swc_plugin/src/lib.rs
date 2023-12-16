use swc_core::common::util::take::Take;
use swc_core::common::Span;
use swc_core::ecma::ast::{CallExpr, Callee, Expr, Ident, Lit, Str};
use swc_core::ecma::{
    ast::Program,
    transforms::testing::test,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct TransformVisitor;

impl VisitMut for TransformVisitor {
    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.visit_mut_children_with(self);

        if n.callee.is_import() {
            n.callee = Callee::Expr(Box::new(Expr::Ident(Ident::new(
                "require".into(),
                Span::dummy(),
            ))));

            n.args = vec![Box::new(Expr::Lit(Lit::Str(Str::from(
                // TODO create by build.rs
                "disable_dynamic_import_swc_plugin/MockPromise.js",
            ))))
            .into()];
        }
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor))
}

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    boo,
    // Input codes
    r#"
    import('./utils').then(({ add }) => { return add(1, 1) });
    import('./utils');
    require("./MockPromise.ts");
    func();
    "#
);
